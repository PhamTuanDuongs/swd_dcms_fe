import type { Metadata, PagePatientResponse } from "~/types";
import type { AppLoadContext } from "@remix-run/cloudflare";

import { api } from "./api";

export async function getPatientById(id: any, context: AppLoadContext) {
    return api(context)
        .get("api/users/metadata/" + id)
        .json();
}

export const updatePatient = async (context: AppLoadContext, patient: Metadata) => {
    try {
        const res = await api(context)
            .post("api/users/metadata/update", {
                json: patient,
            })

            .text();
        return res;
    } catch (error) {
        throw error;
    }
};

export const findAllByNationalId = async (context: AppLoadContext, pageNo = 1, nationalId = "", status = "") => {
    const res = await api(context)
        .get("api/users/patient", {
            searchParams: {
                pageNo,
                nationalId,
                status,
            },
        })
        .json<PagePatientResponse>();

    return res;
};
