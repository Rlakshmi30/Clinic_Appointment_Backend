import { Router } from "express";
import { login, register, refresh, logout } from "../controllers/auth.controller";
import { loginSchema, registerSchema } from "../validators/auth.validators";
import { getMe } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
const router = Router();
router.post("/login", (req, res, next) => {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid login details",
                details: validation.error.flatten().fieldErrors,

            },
        });
    }
    req.body = validation.data;
    next();
},
    login
);
router.post(
    "/register",
    (req, res, next) => {
        const validation = registerSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Invalid registration details",
                    details: validation.error.flatten().fieldErrors,
                },
            });
        }
        req.body = validation.data;
        next();
    },
    register
);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, getMe)
export default router;



