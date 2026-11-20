import bcrypt from "bcrypt";
import { createDoctorRecord } from "../repositories/doctor.repository" ;
import { CreateDoctorInput } from "../validators/doctor.validators";
export const createDoctorServices = async (
    data: CreateDoctorInput
) => {
    const passwordHash = await bcrypt.hash(data.password, 12);

    const doctor = await createDoctorRecord({
        name: data.name,
        email: data.email,
        passwordHash,
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
        consultationFee: data.consultationFee,
        experienceYears: data.experienceYears,
        bio : data.bio,
    });
    return doctor;
};