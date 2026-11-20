import { Router } from "express";
import { healthController } from "../controllers/health.controller.js";
import  doctorRouter from "./doctor.routes";

const router = Router();
router.get("/health", healthController);
router.use("/doctors", doctorRouter);
export default router;  