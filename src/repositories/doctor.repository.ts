import { pool } from "../config/database";

export interface CreateDoctorRecord {
    name: string;
    email: string;
    passwordHash: string;
    specialization: string;
    licenseNumber: string;
    consultationFee: number;
    experienceYears: number;
    bio?: string;
}
export const createDoctorRecord = async (
    doctor: CreateDoctorRecord
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const userResult = await client.query(
            `INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, 'doctor')
            RETURNING id, name, email, role`,
            [doctor.name,
             doctor.email,
             doctor.passwordHash,
            ]
        );
        const user = userResult.rows[0];
        const doctorResult = await client.query(
            `INSERT INTO doctors (
            user_id,
            specialization,
            license_number,
            consultation_fee,
            experience_years,
            bio)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                user.id,
                doctor.specialization,
                doctor.licenseNumber,
                doctor.consultationFee,
                doctor.experienceYears,
                doctor.bio ?? null,
            ]
        );
        await client.query("COMMIT");
        return {
            ...doctorResult.rows[0],
            name: user.name,
            email: user.email,
            role: user.role,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};