import { checkHealth } from "../repositories/health.repository.js";
export async function getHealthStatus(): Promise<{
    status: "ok" | "error";
    database: "connected" | "disconnected";
}>{
    const databaseConnected = await checkHealth();
    return {
        status: databaseConnected ? "ok" : "error",
        database: databaseConnected ? "connected" : "disconnected",
    };
    
}