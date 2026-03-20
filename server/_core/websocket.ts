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

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export function broadcast(_notif: Omit<Notification, "id" | "timestamp">): void {
  // WebSocket désactivé temporairement — notifications via polling
}

export function setupWebSocket(_httpServer: Server): void {
  console.log("Notifications via polling activées");
}
