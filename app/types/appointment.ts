import type { MedstaffMetadata, Metadata } from ".";

export enum APP_STATUS {
    ALL = 0,
    PENDING = 1,
    APPROVED = 2,
    CANCELED = 3,
    COMPLETED = 4,
}

// TODO: replace examination, feedback and prescription field with actual type
export interface Appointment {
    id?: number;
    date: string;
    status: number;
    conclusion: string;
    patient: Metadata;
    medstaff: MedstaffMetadata;
    examination: string;
    feedback: string;
    prescription: string;
    doctor: Metadata;
    room: string;
}

export interface PageAppointmentResponse {
    totalPage: number;
    currentPage: number;
    appointments: Appointment[];
}
