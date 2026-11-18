import { pool } from "../config/database";
export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    `SELECT id, email, password_hash, role
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email]
  );

  return result.rows[0] ?? null;
};
export const findUserById = async (userId: string) => {
  const result = await pool.query(
    `SELECT id, name, email, role
    FROM users
    WHERE id = $1
    LIMIT 1`,
    [userId]
  );
  return result.rows[0] ?? null;
};
export const testDatabaseConnection = async () => {
  const result = await pool.query("SELECT NOW()");
  return result.rows[0];
};

