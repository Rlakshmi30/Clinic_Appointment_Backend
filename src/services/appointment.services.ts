
import { appointmentRepository } from "../repositories/appointment.repository.js";

interface CreateAppointmentInput {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
}

export const appointmentService = {
  async createAppointment(data: CreateAppointmentInput) {
    if (!data.patientId || !data.doctorId) {
      throw new Error("Patient ID and Doctor ID are required");
    }
    if (!data.date || !data.time) {
      throw new Error ("Appointment date and time are required");
    }
    if (!data.reason || data.reason.length < 10 || data.reason.length > 300) {
      throw new Error ("Reason must be between 10 and 300 characters");
    }
    return await appointmentRepository.create(
      data.patientId,
      data.doctorId,
      data.date,
      data.time,
      data.reason
    );

  },
};
