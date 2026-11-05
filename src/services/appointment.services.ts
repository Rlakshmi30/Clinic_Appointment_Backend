
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
    const appointment = await appointmentRepository.create(
      data.patientId,
      data.doctorId,
      data.date,
      data.time,
      data.reason
    );

    return appointment;
  },
};
