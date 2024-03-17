import type { AppLoadContext } from "@remix-run/cloudflare";

import type { Medstaff } from "../types/medstaff";

import { api } from "./api";

import type { MedstaffMetadata, Metadata, PageEmployeeResponse } from "~/types";

export async function getEmployees(context: AppLoadContext) {
    return api(context).get("admin/employee/abc").json<Medstaff[]>();
}
export const createEmployee = async (employee: any, context: AppLoadContext) => {
    await api(context).post("admin/employee/add", { json: employee }).json();
};

export async function getEmployeesById(id: any, context: AppLoadContext) {
    return api(context)
        .get("admin/employee/" + id)
        .json();
}

export const updateMedStaff = async (context: AppLoadContext, info: any) => {
    const res = await api(context)
        .post("admin/employee/update", {
            json: info,
        })
        .json();
    return res;
};
export const getUserByEmail = async (context: AppLoadContext, email: any) => {
    const res = await api(context).get(`admin/employee/email/${email}`).json<Medstaff>();

    return res;
};
export const getUserByNationalID = async (context: AppLoadContext, nationalID: any) => {
    const res = await api(context).get(`admin/employee/nationalID/${nationalID}`).json<Medstaff>();

    return res;
};

export const deleteEmployee = async (id: any, context: AppLoadContext) => {
    return await api(context).delete(`admin/employee/delete/${id}`);
};
export const getUserByNameAndRole = async (context: AppLoadContext, role: any, name: any) => {
    const res = await api(context).get(`admin/employee/role/${role}/name/${name}`).json<Medstaff[]>();

    return res;
};
export const getUserByRole = async (context: AppLoadContext, role: any) => {
    const res = await api(context).get(`admin/employee/role/${role}`).json<Medstaff[]>();

    return res;
};

export const getMedStaffProfile = async (context: AppLoadContext, id: any) => {
    const res = await api(context).get(`api/users/med_staff/${id}`).json();
    return res;
};

export const findAllEmployee = async (context: AppLoadContext, pageNo = 1) => {
    const res = await api(context)
        .get("admin/employee/all", {
            searchParams: {
                pageNo,
            },
        })
        .json<PageEmployeeResponse>();

    return res;
};
