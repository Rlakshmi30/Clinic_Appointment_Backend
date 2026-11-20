import { pool } from "../config/database.js";

export const appointmentRepository = {
    async create(
        patientId: string,
        doctorId: string,
        date: string,
        time: string,
        reason?: string
    ) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const doctorResult = await client.query(
                `SELECT id
                FROM doctors
                WHERE id = $1 AND is_active = TRUE`,
                [doctorId]
            );
            if (doctorResult.rowCount === 0) {
                throw new Error("DOCTOR_NOT_AVAILABLE");

            }
            const result = await pool.query(
                `INSERT INTO appointments
   (patients_id, doctor_id, appointments_date, appointments_time, reason)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING *`,
                [patientId, doctorId, date, time, reason ?? null]
            );
            await client.query("COMMIT");
            return result.rows[0];
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    },
};