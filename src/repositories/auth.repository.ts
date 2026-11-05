import { pool } from "../config/database";
export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    "SELECT id, email, password_hash, role FROM users WHERE email = $1 LIMIT 1",
    [email]
  );

  return result.rows[0] ?? null;
};
export const testDatabaseConnection = async () => {
  const result = await pool.query("SELECT NOW()");
  return result.rows[0];
};

