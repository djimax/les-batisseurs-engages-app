import express from "express";
import http from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { systemRouter } from "./systemRouter";
import { createContext } from "./trpc";
import { setupWebSocket } from "./websocket";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "https://les-batisseurs-engages-app.vercel.app",
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use("/trpc", createExpressMiddleware({ router: systemRouter, createContext }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = parseInt(process.env.PORT || "8080", 10);
const httpServer = http.createServer(app);
setupWebSocket(httpServer);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur démarré port ${PORT}`);
  console.log(`🔔 WebSocket actif sur /ws`);
});

process.on("SIGTERM", () => {
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000);
});
