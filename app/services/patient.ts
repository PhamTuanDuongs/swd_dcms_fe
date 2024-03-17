import type { AppLoadContext } from "@remix-run/cloudflare";

import { api } from "./api";

import type { Metadata } from "~/types";
import { PageResponse } from "~/types/common";

export async function getPatientById(id: number, context: AppLoadContext) {
    return api(context)
        .get("api/patients/" + id)
        .json<Metadata>();
}

export const updatePatient = async (context: AppLoadContext, patient: Metadata) => {
    return api(context)
        .post(`api/patients/update`, {
            json: patient,
        })
        .text();
};

export const findAllByNationalId = async (context: AppLoadContext, pageNo = 1, nationalId = "") => {
    return api(context)
        .get("api/patients", {
            searchParams: {
                pageNo,
                nationalId,
            },
        })
        .json<PageResponse<Metadata>>();
};
