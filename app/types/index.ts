import { PageResponse } from "./common";
import { Appointment } from "./appointment";

export interface User {
    id: number;
    email: string;
    createdAt: string;
    verifiedAt: string;
    resetPasswordToken?: string;
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
    email: string;
    roleName: string;
    createdAt: string;
}

export interface Role {
    id: number;
    roleName: string;
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

export type PagePatientResponse = PageResponse<User>;

export interface Service {
    id: number;
    name: string;
    price: string;
    description: string;
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

export interface Employee {
    id: number;

    name: string;

    role: string;

    email: string;

    phone: string;
}
export interface PageEmployeeResponse {
    currentPage: number;
    totalPage: number;
    employees: Employee[];
}

export interface EmployeeDetail {
    email: string;
    name: string;
    dob: string;
    address: string;
    phoneNo: string;
    gender: boolean;
    nationalId: string;
    role: string;
    qualification: string;
    experience: string;
}
