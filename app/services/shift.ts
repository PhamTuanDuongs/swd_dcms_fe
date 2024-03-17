import type { AppLoadContext } from "@remix-run/cloudflare";

import { api } from "./api";

import type { Shift } from "~/types/shift";

export const getWeeklyShifts = async (context: AppLoadContext, startDate: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set("start", startDate);

    const res = await api(context)
        .get("api/shifts", {
            searchParams,
        })
        .json<Shift[]>();

    return res;
};

export const createOrUpdateStaffShift = async (context: AppLoadContext, metadataId: number, shiftId: number, room: string) => {
    await api(context).post("api/shifts/staff-shift", {
        json: {
            metadataId,
            shiftId,
            room,
        },
    });
};
