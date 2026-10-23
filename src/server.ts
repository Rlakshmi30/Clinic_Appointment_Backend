
import express from "express";
import "dotenv/config";

const app = express();
const port = Number(process.env.PORT || 8000);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend running on port ${port}`);
});
