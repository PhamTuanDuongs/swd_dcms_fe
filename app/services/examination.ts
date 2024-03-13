import { type AppLoadContext } from "@remix-run/cloudflare";
import { api } from "./api";
import { PapeExaminationResponse, type PagePatientResponse, Examination } from "~/types";

export async function getAllExaminationByAppointId(context: AppLoadContext, id: number, pageNo = 1) {
    const res = await api(context)
        .get(`api/examination/all/${id}`, {
            searchParams: {
                pageNo,
            },
        })
        .json<PapeExaminationResponse>();
    return res;
}

export async function AddNewExamination(context: AppLoadContext, examinationDTO: any) {
    try {
        const res = await api(context)
            .post("api/examination/add", {
                json: examinationDTO,
            })
            .text();

        return res;
    } catch (error) {
        throw error;
    }
}

export async function GetExaminationById(context: AppLoadContext, id: number) {
    const res = await api(context).get(`api/examination/${id}`).json<Examination>();
    return res;
}


export async function UpdateExaminationById(context: AppLoadContext, examinationDTO: any) {
    try {
        const res = await api(context)
            .post("api/examination/update", {
                json: examinationDTO,
            })
            .text();

        return res;
    } catch (error) {
        throw error;
    }
}

export async function UpdateImageExameById(context: AppLoadContext, examinationDTO: any) {
    try {
        const res = await api(context)
            .post("api/examination/update/image", {
                json: examinationDTO,
            })
            .text();

        return res;
    } catch (error) {
        throw error;
    }
}