import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { checkDatabaseConnection } from "./config/database";

const app = express ();
const port = Number(process.env.PORT || 8000);

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);

app.get("/health", async(_req, res) => {
  const databaseConnected = await checkDatabaseConnection();
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "error",
    database: databaseConnected ? "connected" : "disconnected",
  });
});
app.listen(port, "0.0.0.0", () => {
  console.log(`Backend running on port ${port}`);
})