import { Router } from "express";
import { createDoctorController } from "../controllers/doctor.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
const router = Router();
router.post("/", authenticate, authorize("admin"), createDoctorController);
export default router;