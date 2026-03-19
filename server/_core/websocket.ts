import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

export interface Notification {
  id: string;
  type: string;
  level: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  link?: string;
  timestamp: string;
}

interface ExtSocket extends WebSocket {
  isAlive?: boolean;
  socketId?: string;
}

const connections = new Map<string, ExtSocket>();

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export function broadcast(notif: Omit<Notification, "id" | "timestamp">): void {
  const payload = { ...notif, id: genId(), timestamp: new Date().toISOString() };
  const msg = JSON.stringify({ type: "notification", data: payload });
  for (const socket of connections.values()) {
    if (socket.readyState === WebSocket.OPEN) socket.send(msg);
  }
}

export function setupWebSocket(httpServer: Server): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  const hb = setInterval(() => {
    for (const [id, socket] of connections.entries()) {
      if (!socket.isAlive) { connections.delete(id); socket.terminate(); return; }
      socket.isAlive = false;
      socket.ping();
    }
  }, 30_000);

  wss.on("close", () => clearInterval(hb));

  wss.on("connection", (socket: ExtSocket) => {
    socket.isAlive = true;
    socket.socketId = genId();
    connections.set(socket.socketId, socket);
    socket.send(JSON.stringify({ type: "connected", socketId: socket.socketId }));
    socket.on("pong", () => { socket.isAlive = true; });
    socket.on("close", () => { if (socket.socketId) connections.delete(socket.socketId); });
    socket.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "ping") socket.send(JSON.stringify({ type: "pong" }));
      } catch {}
    });
  });

  console.log("WebSocket démarré sur /ws");
  return wss;
}
