import { type ActionArgs, json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { createOrUpdateStaffShift, getWeeklyShifts } from "~/services/shift";
import { getAllMondayOfYear, getMondayOfWeek } from "~/utils/function/dateUtils";
import ScheduleTable from "./ScheduleTable";
import dayjs from "dayjs";
import { getEmployees } from "~/services/medstaff";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { HTTPError } from "ky-universal";
import type { MedstaffMetadata } from "~/types";
import { requireAdmin } from "~/utils/function/UserUtils";
import { useState } from "react";

export const meta: V2_MetaFunction = () => {
    return [
        {
            title: "Schedules - DCMS",
        },
    ];
};

export async function loader({ context, request }: LoaderArgs) {
    try {
        await requireAdmin(request);

        const url = new URL(request.url);
        let startDateParams = url.searchParams.get("startDate");

        const startDate = startDateParams ? new Date(startDateParams) : new Date();
        const monday = getMondayOfWeek(startDate);

        const shifts = await getWeeklyShifts(context, dayjs(monday).format("YYYY-MM-DD"));
        const employees = (await getEmployees(context)) as unknown as MedstaffMetadata[];

        return json({ shifts, employees, monday });
    } catch (error) {
        throw error;
    }
}

export const ROOMS = ["None", "Room 1", "Room 2", "Room 3", "Room 4"];

const ZChangeStaffShift = zfd.formData({
    metadataId: zfd.numeric(z.number()),
    shiftId: zfd.numeric(z.number()),
    room: zfd.text(z.string().nonempty()),
});

export async function action({ request, context }: ActionArgs) {
    try {
        await requireAdmin(request);

        const { metadataId, shiftId, room } = ZChangeStaffShift.parse(await request.formData());

        await createOrUpdateStaffShift(context, metadataId, shiftId, room);

        return json({ message: "Schedule updated successfully!", ok: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return json({ message: "Invalid data", ok: false }, { status: 400 });
        } else if (error instanceof HTTPError) {
            return json({ message: "Failed to update schedule", ok: false }, { status: error.response.status });
        }
    }
}

export default function SchedulePage() {
    const navigate = useNavigate();
    const { shifts, employees, monday } = useLoaderData<typeof loader>();

    const [year, setYear] = useState(new Date().getFullYear());

    const mondays = getAllMondayOfYear(year).map(
        (monday) => `${dayjs(monday).format("MM-DD")} to ${dayjs(monday).add(6, "day").format("MM-DD")}`
    );

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Weekly Schedule</h1>

            <div className="flex mt-4">
                {/* <select
                    onChange={(e) => navigate(`/schedules?startDate=${year}-${e.target.value.split(" to ")[0]}`)}
                    defaultValue={`${dayjs(monday).format("MM-DD")} to ${dayjs(monday).add(6, "day").format("MM-DD")}`}
                    className=" inline-block w-1/6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {mondays.map((m, i) => (
                        <option key={i} value={m}>
                            {m}
                        </option>
                    ))}
                </select> */}

                <select
                    onChange={(e) => navigate(`/schedules?startDate=${year}-${e.target.value.split(" to ")[0]}`)}
                    defaultValue={`${dayjs(monday).format("MM-DD")} to ${dayjs(monday).add(6, "day").format("MM-DD")}`}
                    className="mt-4 inline-block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {mondays.map((m, i) => (
                        <option key={i} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-4">
                <ScheduleTable shifts={shifts} employees={employees} />
            </div>
        </div>
    );
}
