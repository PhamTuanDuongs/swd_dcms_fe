import type { AppLoadContext } from "@remix-run/cloudflare";

import { api } from "./api";

import type { PageAppointmentResponse } from "~/types/appointment";
import { userCookie } from "~/utils/function/UserCookie";

export async function getAllPendingAndApprovedAppointments(context: AppLoadContext, pageNo = 1, status: number) {
    const res = await api(context)
        .get("api/appointment", {
            searchParams: {
                pageNo,
                status,
            },
        })
        .json<PageAppointmentResponse>();

    return res;
}

export async function GetAppointmentDetail(id: any, context: AppLoadContext, request: Request) {
    const cookieHeader = request.headers.get("Cookie");
    const token = (await userCookie.parse(cookieHeader)) || null;

    return await api(context)
        .get(`api/appointment/view/${id}`, {
            headers: {
                Authorization: token,
            },
        })
        .json();
}

export async function GetAppointmentHistory(id: any, page: any, sortBy: any, query: any, context: AppLoadContext, request: Request) {
    return await api(context).get(`api/appointment/view_history/${id}?page=${page}&sortBy=${sortBy}&query=${query}`).json();
}

export async function CancleAppointment(id: number, context: AppLoadContext) {
    return await api(context).delete(`api/appointment/cancle/${id}`).text();
}

export async function ApproveAppointment(id: number, context: AppLoadContext) {
    return await api(context).post(`api/appointment/approve/${id}`).text();
}
