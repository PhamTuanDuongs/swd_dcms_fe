import { Appointment } from "./appointment";
import type { Medstaff } from "./medstaff";

export interface User {
    id: number;
    email: string;
    createdAt: string;
    metadata: Metadata;
    role: Role;
}
export interface UserMetadata {
    email: string;
    metadata: Metadata;
}
export interface Metadata {
    id?: number;
    name: string;
    dob: string;
    address: string;
    phoneNo: string;
    gender: boolean;
    nationalId: string;
    avatar?: string;
}

export interface Role {
    id?: number;
    name: string;
}

export interface Avatar {
    id: string;
    url: string;
}

export interface UserMedstaff {
    id: string;
    createdAt: string;
    email: string;
    role: Role;
    metadata: Metadata;
}
export interface MedstaffMetadata {
    id: number;
    userDTO: UserMedstaff;
    qualification: string;
    experience: string;
}
export interface PageEmployeeResponse {
    totalPages: number;
    currentPage: number;
    employees: Medstaff[];
}
export interface PagePatientResponse {
    totalPages: number;
    currentPage: number;
    patients: User[];
}
export interface Service {
    id: number;
    name: string;
    price: string;
    description: string;
    deleted: boolean;
}
export interface Examination {
    id: number;
    textResult: string;
    imgResult: string;
    service: Service;
}

export interface PapeExaminationResponse {
    currentPage: number;
    totalPage: number;
    examinations: Examination[];
    appointment: Appointment;
}
