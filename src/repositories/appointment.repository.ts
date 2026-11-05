import { pool } from "../config/database.js";

export const appointmentRepository = {
    async create (
        patientId: string,
        doctorId: string,
        date: string,
        time: string,
        reason?: string
    ){
        const result = await pool.query(
    `INSERT INTO appointments
   (patients_id, doctor_id, appointments_date, appointments_time, reason)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING *`,
  [patientId, doctorId, date, time, reason || null]
);
        return result.rows[0];
    },
};