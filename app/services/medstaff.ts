import { api } from "./api";

import type { Medstaff } from "../types/medstaff";
import type { AppLoadContext } from "@remix-run/cloudflare";
import type { MedstaffMetadata, PageEmployeeResponse, Metadata } from "~/types";

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

export const updateMedStaff = async (context: AppLoadContext, medstaff: MedstaffMetadata) => {
    try {
        const res = await api(context)
            .post("admin/employee/update", {
                json: medstaff,
            })
            .text();

        return res;
    } catch (error) {
        throw error;
    }
};
export const getUserByEmail = async (context: AppLoadContext, email: any) => {
    try {
        const res = await api(context).get(`admin/employee/email/${email}`).json<Medstaff>();

        return res;
    } catch (error) {
        throw error;
    }
};
export const getUserByNationalID = async (context: AppLoadContext, nationalID: any) => {
    try {
        const res = await api(context).get(`admin/employee/nationalID/${nationalID}`).json<Medstaff>();

        return res;
    } catch (error) {
        throw error;
    }
};

export const deleteEmployee = async (id: any, context: AppLoadContext) => {
    try {
        return await api(context).delete(`admin/employee/delete/${id}`);
    } catch (error) {
        throw error;
    }
};
export const getUserByNameAndRole = async (context: AppLoadContext, role: any, name: any) => {
    try {
        const res = await api(context).get(`admin/employee/role/${role}/name/${name}`).json<Medstaff[]>();

        return res;
    } catch (error) {
        throw error;
    }
};
export const getUserByRole = async (context: AppLoadContext, role: any) => {
    try {
        const res = await api(context).get(`admin/employee/role/${role}`).json<Medstaff[]>();

        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getMedStaffProfile = async (context: AppLoadContext, id: any) => {
    try {
        const res = await api(context).get(`api/users/med_staff/${id}`).json();
        return res;
    } catch (error) {
        throw error;
    }
};

export const findAllRoleAndName = async (context: AppLoadContext, pageNo = 1, role = "", name = "", status = "") => {
    const res = await api(context)
        .get("admin/employee/all", {
            searchParams: {
                pageNo,
                role,
                name,
                status,
            },
        })
        .json<PageEmployeeResponse>();

    return res;
};
