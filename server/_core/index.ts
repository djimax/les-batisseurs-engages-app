/**
 * server/_core/index.ts — Point d'entrée serveur adapté Railway
 *
 * INSTALLATION : remplace server/_core/index.ts
 *
 * Changements vs version originale :
 * - Utilise process.env.PORT (Railway injecte le port automatiquement)
 * - Crée un httpServer HTTP explicite (nécessaire pour WebSocket)
 * - Appelle setupWebSocket(httpServer)
 * - CORS configuré pour accepter le domaine Vercel du frontend
 * - Graceful shutdown sur SIGTERM (Railway envoie ce signal à l'arrêt)
 */

import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router";        // votre router tRPC existant
import { createContext } from "./trpc";       // votre createContext existant
import { setupWebSocket } from "./websocket"; // nouveau

const app = express();

// ─────────────────────────────────────────────
// CORS — autorise le frontend Vercel + localhost dev
// ─────────────────────────────────────────────
const allowedOrigins = [
  "https://les-batisseurs-engages-app.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  // Ajouter ici d'autres domaines si nécessaire
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (ex: Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS bloqué pour : ${origin}`));
    },
    credentials: true, // nécessaire pour les cookies auth_token
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─────────────────────────────────────────────
// Routes tRPC
// ─────────────────────────────────────────────
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError({ error, path }) {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`[tRPC] Erreur sur ${path}:`, error.message);
      }
    },
  })
);

// ─────────────────────────────────────────────
// Health check (Railway l'utilise pour vérifier que le service est up)
// ─────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// ─────────────────────────────────────────────
// Serveur HTTP + WebSocket
// ─────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "3000", 10);
const httpServer = http.createServer(app);

// Activer WebSocket sur le même port HTTP
setupWebSocket(httpServer);

// ─────────────────────────────────────────────
// Démarrage
// ─────────────────────────────────────────────
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🔔 WebSocket actif sur ws://0.0.0.0:${PORT}/ws`);
  console.log(`🌍 Environnement : ${process.env.NODE_ENV}`);
});

// ─────────────────────────────────────────────
// Graceful shutdown (Railway envoie SIGTERM avant d'arrêter le container)
// ─────────────────────────────────────────────
process.on("SIGTERM", () => {
  console.log("SIGTERM reçu — arrêt en cours...");
  httpServer.close(() => {
    console.log("Serveur arrêté proprement.");
    process.exit(0);
  });

  // Forcer l'arrêt après 10s si des connexions traînent
  setTimeout(() => process.exit(1), 10_000);
});

process.on("SIGINT", () => {
  httpServer.close(() => process.exit(0));
});
