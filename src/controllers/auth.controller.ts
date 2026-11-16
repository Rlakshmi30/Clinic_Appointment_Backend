import type { Request, Response, NextFunction } from "express";
import { loginUser, registerUser, } from "../services/auth.service";
import { env } from "../config/env";
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {email, password } = req.body;
     const result = await loginUser({
      email,
      password,
     });
     return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
     });
    } catch (error){
      next(error);
    }
  };
  export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try{
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
      } catch(error){
        next(error);
    }
  };
