
import type { Request, Response } from "express";
import { checkHealth } from "../repositories/health.repository.js";
export async function healthController(
  _req: Request,
  res: Response
): Promise <void> {
    const databaseConnected = await checkHealth();
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "error",
    database: databaseConnected ? "connected" : "disconnected",
  });
}
