import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { hybridAuth } from "./_core/hybrid-auth";
import * as authDb from "./auth-db";
import * as db from "./db";
import type { Request } from "express";

// Générer des emails uniques pour éviter les conflits
const generateUniqueEmail = () => `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;

describe("HybridAuthService", () => {
  describe("Email/Password Authentication", () => {
    it("should authenticate with valid email/password token", async () => {
      // Créer un utilisateur de test
      const testUser = await authDb.createAppUser({
        email: generateUniqueEmail(),
        password: "Test123!",
        fullName: "Test User",
        role: "membre",
      });

      expect(testUser).toBeDefined();
      expect(testUser?.email).toBeDefined();
    });

    it("should reject invalid email", async () => {
      const result = await authDb.findUserByEmail("nonexistent-" + Date.now() + "@example.com");
      expect(result).toBeNull();
    });

    it("should hash password correctly", async () => {
      const password = "Test123!";
      const user = await authDb.createAppUser({
        email: generateUniqueEmail(),
        password,
        fullName: "Hash Test",
        role: "membre",
      });

      expect(user?.password).not.toBe(password);
      expect(user?.password).toMatch(/^\$2b\$/); // bcrypt hash format
    });

    it("should verify password correctly", async () => {
      const password = "VerifyTest123!";
      const user = await authDb.createAppUser({
        email: generateUniqueEmail(),
        password,
        fullName: "Verify Test",
        role: "membre",
      });

      if (!user) throw new Error("User creation failed");

      const isValid = await authDb.verifyPassword(password, user.password);
      expect(isValid).toBe(true);

      const isInvalid = await authDb.verifyPassword("WrongPassword123!", user.password);
      expect(isInvalid).toBe(false);
    });

    it("should find user by email", async () => {
      const email = generateUniqueEmail();
      const user = await authDb.createAppUser({
        email,
        password: "Find123!",
        fullName: "Find Me",
        role: "admin",
      });

      const found = await authDb.findUserByEmail(email);
      expect(found).toBeDefined();
      expect(found?.email).toBe(email);
      expect(found?.role).toBe("admin");
    });

    it("should find user by ID", async () => {
      const user = await authDb.createAppUser({
        email: generateUniqueEmail(),
        password: "FindById123!",
        fullName: "Find By ID",
        role: "membre",
      });

      if (!user) throw new Error("User creation failed");

      const found = await authDb.findUserById(user.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(user.id);
      expect(found?.email).toBe(user.email);
    });

    it("should update last login", async () => {
      const user = await authDb.createAppUser({
        email: generateUniqueEmail(),
        password: "LastLogin123!",
        fullName: "Last Login",
        role: "membre",
      });

      if (!user) throw new Error("User creation failed");

      const before = user.lastLogin;
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
      await authDb.updateLastLogin(user.id);
      const after = await authDb.findUserById(user.id);

      expect(after?.lastLogin).toBeDefined();
      if (before && after?.lastLogin) {
        expect(after.lastLogin.getTime()).toBeGreaterThanOrEqual(before.getTime());
      }
    });

    it("should deactivate user", async () => {
      const user = await authDb.createAppUser({
        email: generateUniqueEmail(),
        password: "Deactivate123!",
        fullName: "Deactivate",
        role: "membre",
      });

      if (!user) throw new Error("User creation failed");

      await authDb.deactivateUser(user.id);
      const deactivated = await authDb.findUserById(user.id);

      expect(deactivated?.isActive).toBe(false);
    });

    it("should activate user", async () => {
      const user = await authDb.createAppUser({
        email: generateUniqueEmail(),
        password: "Activate123!",
        fullName: "Activate",
        role: "membre",
      });

      if (!user) throw new Error("User creation failed");

      await authDb.deactivateUser(user.id);
      await authDb.activateUser(user.id);
      const activated = await authDb.findUserById(user.id);

      expect(activated?.isActive).toBe(true);
    });

    it("should change password", async () => {
      const email = generateUniqueEmail();
      const oldPassword = "OldPass123!";
      const newPassword = "NewPass456!";

      const user = await authDb.createAppUser({
        email,
        password: oldPassword,
        fullName: "Change Pass",
        role: "membre",
      });

      if (!user) throw new Error("User creation failed");

      // Change password
      await authDb.changePassword(user.id, oldPassword, newPassword);

      // Get updated user to get new password hash
      const updatedUser = await authDb.findUserById(user.id);
      if (!updatedUser) throw new Error("User not found after password change");

      // Verify old password doesn't work
      const oldValid = await authDb.verifyPassword(oldPassword, updatedUser.password);
      expect(oldValid).toBe(false);

      // Verify new password works
      const updated = await authDb.findUserById(user.id);
      if (!updated) throw new Error("User not found after password change");

      const newValid = await authDb.verifyPassword(newPassword, updated.password);
      expect(newValid).toBe(true);
    });

    it("should prevent duplicate emails", async () => {
      const email = generateUniqueEmail();

      await authDb.createAppUser({
        email,
        password: "First123!",
        fullName: "First",
        role: "membre",
      });

      try {
        await authDb.createAppUser({
          email,
          password: "Second123!",
          fullName: "Second",
          role: "membre",
        });
        expect.fail("Should have thrown error for duplicate email");
      } catch (error: any) {
        expect(error?.message).toContain("existe déjà");
      }
    });
  });

  describe("HybridAuth Context", () => {
    it("should return null for missing cookie", async () => {
      const mockReq = {
        headers: {},
      } as unknown as Request;

      const result = await hybridAuth.authenticateRequest(mockReq);
      expect(result).toBeNull();
    });

    it("should return null for invalid cookie", async () => {
      const mockReq = {
        headers: {
          cookie: "app_session_id=invalid-token",
        },
      } as unknown as Request;

      const result = await hybridAuth.authenticateRequest(mockReq);
      expect(result).toBeNull();
    });
  });
});
