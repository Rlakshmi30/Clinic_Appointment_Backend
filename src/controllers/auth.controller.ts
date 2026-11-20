import type { Request, Response, NextFunction } from "express";
import { loginUser, registerUser, refreshUserToken, logoutUser } from "../services/auth.service";
import { env } from "../config/env";
import { findUserById } from "../repositories/auth.repository";
import type { AuthRequest } from "../middleware/auth.middleware";
const setRefreshCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/v1/auth",
  });
};
const clearRefreshCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/v1/auth",
  });
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({
      email,
      password,
    });
    setRefreshCookie(res, result.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone, password } = req.body;

    const result = await registerUser({
      name,
      email,
      phone,
      password,
    });
    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.refreshToken;
    const result = await refreshUserToken(token);
    setRefreshCookie(res, result.refreshToken);
    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    clearRefreshCookie(res);
    next(error);
  }
}; export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await logoutUser(req.cookies?.refreshToken);
    clearRefreshCookie(res);
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error("User authentication required");
    }
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }
    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}
