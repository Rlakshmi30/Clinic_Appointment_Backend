import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import { findUserByEmail } from "../repositories/auth.repository";
import { AppError } from "../utils/app-error";
import { env } from "../config/env";
import { pool } from "../config/database";
interface LoginInput {
  email: string;
  password: string;
}
interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}
const generateRefreshToken = (user: {
  id: string;
  role: string;
}) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );
};
const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
export const loginUser = async ({ email, password }: LoginInput) => {
  if (!email || !password) {
    throw new AppError(
      "Email and Password are required",
      400,
      "VALIDATION_ERROR"
    );

  }
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw new AppError(
      "Invalid email or Password",
      401,
      "INVALID_CREDENTIALS"
    );
  }
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email or password",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );
  const refreshToken = generateRefreshToken(user);
  const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, to_timestamp($3))`,
    [user.id, hashToken(refreshToken), decoded.exp]
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const registerUser = async ({
  name,
  email,
  phone,
  password,
}: RegisterInput) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new AppError(
      "Email is already registered",
      409,
      "EMAIL_ALREADY_EXISTS"
    );
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
    VALUES($1, $2, $3, $4)
    RETURNING id, name, email, role`,
      [name.trim(), normalizedEmail, passwordHash, "patient"]
    );
    const user = userResult.rows[0];
    await client.query(
      `INSERT INTO patients (user_id, phone)
    VALUES ($1, $2)`,
      [user.id, phone.trim()]
    );
    await client.query("COMMIT");
    return user;
  } catch (error) {
    await client.query("ROLLBACK");
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      throw new AppError(
        "Email is already registered",
        409,
        "EMAIL_ALREADY_EXISTS"
      );
    }
    throw error;
  } finally {
    client.release();
  }
};
export const logoutUser = async (token?: string) => {
  if(!token) return;
  await pool.query(
    `UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE token_hash = $1
    AND revoked_at IS NULL`,
    [hashToken(token)]
  );
};
export const refreshUserToken = async (token: string) => {
  if(!token) {
    throw new AppError(
      "Refresh token is required",
      401,
      "INVALID_REFRESH_TOKEN"
    );
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let decoded: JwtPayload;
    try {
      const verified = jwt.verify(token, env.JWT_REFRESH_SECRET);
      if (
        typeof verified === "string" ||
        typeof verified.userId !== "string" ||
        typeof verified.role !== "string"
      ) {
        throw new Error("Invalid token");
      }
      decoded = verified;
    } catch {
      throw new AppError(
        "Invalid or expired refresh token",
        401,
        "INVALID_REFRESH_TOKEN"
      );
    }
    const tokenResult = await client.query(
      `SELECT id, user_id
      FROM refresh_tokens
      WHERE token_hash = $1
      AND revoked_at IS NULL
      AND expires_at > NOW()
      FOR UPDATE`,
      [hashToken(token)]
    );
    if (tokenResult.rows.length === 0){
      throw new AppError(
        "Refresh token is invalid or expired",
        401,
        "INVALID_REFRESH_TOKEN"
      );
    }
    const userResult = await client.query(
      `SELECT id, name, email, role
      FROM users
      WHERE id = $1`,
      [tokenResult.rows[0].user_id]
    );
    const user = userResult.rows[0];
    if ( 
      !user || 
      user.id !== decoded.userId ||
      user.role !== decoded.role
    ) {
      throw new AppError(
        "Invalid refresh token",
        401,
        "INVALID_REFRESH_TOKEN"
      );
    }
    const accessToken = jwt.sign(
{
  userId: user.id, role: user.role
},
env.JWT_SECRET,
{
  expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
}

    );
    const newRefreshToken = generateRefreshToken(user);
    const newDecoded = jwt.decode(newRefreshToken) as jwt.JwtPayload;
    await client.query(
      `UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE token_hash = $1`,
      [hashToken(token)]
    );
    await client.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES ($1, $2, to_timestamp($3))`,
      [user.id, hashToken(newRefreshToken), newDecoded.exp]
    );
    await client.query("COMMIT");
    
return {
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  accessToken,
  refreshToken : newRefreshToken,
};
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};





