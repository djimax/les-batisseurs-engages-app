import { COOKIE_NAME } from "@shared/const";
import { jwtVerify } from "jose";
import type { Request } from "express";
import { ENV } from "./env";
import type { User } from "../../drizzle/schema";
import type { AppUser } from "../../drizzle/schema";
import * as db from "../db";
import * as authDb from "../auth-db";
import { ForbiddenError } from "@shared/_core/errors";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

/**
 * Système d'authentification hybride supportant :
 * 1. OAuth Manus (openId, appId, name)
 * 2. Email/Password (userId, email)
 */
export class HybridAuthService {
  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return new Map<string, string>();
    }

    const parsed = require("cookie").parse(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  /**
   * Vérifier un token OAuth
   */
  private async verifyOAuthSession(
    cookieValue: string | undefined | null
  ): Promise<{ openId: string; appId: string; name: string } | null> {
    if (!cookieValue) {
      return null;
    }

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { openId, appId, name } = payload as Record<string, unknown>;

      if (
        !isNonEmptyString(openId) ||
        !isNonEmptyString(appId) ||
        !isNonEmptyString(name)
      ) {
        return null;
      }

      return { openId, appId, name };
    } catch (error) {
      return null;
    }
  }

  /**
   * Vérifier un token Email/Password
   */
  private async verifyEmailPasswordSession(
    cookieValue: string | undefined | null
  ): Promise<{ userId: number; email: string } | null> {
    if (!cookieValue) {
      return null;
    }

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { userId, email } = payload as Record<string, unknown>;

      if (typeof userId !== "number" || !isNonEmptyString(email)) {
        return null;
      }

      return { userId, email };
    } catch (error) {
      return null;
    }
  }

  /**
   * Authentifier une requête avec support OAuth et Email/Password
   */
  async authenticateRequest(req: Request): Promise<User | null> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);

    if (!sessionCookie) {
      return null;
    }

    // Essayer OAuth d'abord
    const oauthSession = await this.verifyOAuthSession(sessionCookie as string | null);
    if (oauthSession) {
      try {
        const sessionUserId: string = oauthSession.openId;
        const signedInAt = new Date();
        let user = await db.getUserByOpenId(sessionUserId);

        if (!user) {
          // Essayer de synchroniser depuis le serveur OAuth
          return null;
        }

          // Mettre à jour le dernier login
        await db.upsertUser({
          openId: user.openId,
          lastSignedIn: signedInAt,
        });

        return user;
      } catch (error) {
        console.error("[Auth] OAuth authentication failed:", error);
        return null;
      }
    }

    // Essayer Email/Password
    const emailPasswordSession = await this.verifyEmailPasswordSession(
      sessionCookie as string | null
    );
    if (emailPasswordSession) {
      try {
        const appUser = await authDb.findUserById(Number(emailPasswordSession.userId));
        if (!appUser || !appUser.isActive) {
          return null;
        }

      // Mettre à jour le dernier login
      await authDb.updateLastLogin(appUser.id);

        // Créer un utilisateur virtuel de type User pour la compatibilité
        // On utilise l'email comme openId temporaire
        const virtualUser: User = {
          id: appUser.id,
          openId: `app-user-${appUser.id}`,
          name: appUser.fullName || appUser.email || "User",
          email: appUser.email || null,
          loginMethod: "email",
          role: appUser.role as "admin" | "user",
          createdAt: appUser.createdAt,
          updatedAt: appUser.updatedAt,
          lastSignedIn: new Date(),
        };

        return virtualUser;
      } catch (error) {
        console.error("[Auth] Email/Password authentication failed:", error);
        return null;
      }
    }

    return null;
  }
}

export const hybridAuth = new HybridAuthService();
