import type { Request, Response } from "express";
import { loginUser } from "../services/auth.service";

export const login = async (_req: Request, res: Response) => {
  try {
    await loginUser();

    return res.status(200).json({
      message: "Login successful",
    });
  } catch {
    return res.status(501).json({
      message: "Login is not implemented yet",
    });
  }
};
