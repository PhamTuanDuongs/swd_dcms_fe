import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { HTTPError } from "ky";

import HistoryTable from "./HistoryTable";

import { GetAppointmentHistory } from "~/services/appointment";
import { requireUser } from "~/utils/function/UserUtils";

export async function loader({ request, context, params }: LoaderFunctionArgs) {
    await requireUser(request);
    try {
        const url = new URL(request.url);
        const page = url.searchParams.get("page") || 1;
        const sortBy = url.searchParams.get("sortBy") || "latest";
        const query = url.searchParams.get("query") || "all";
        const data = await GetAppointmentHistory(params?.id, page, sortBy, query, context, request);
        return { data, patientId: params?.id };
    } catch (error) {
        if (error instanceof HTTPError) {
            const status = error.response.status;
            throw new Response(
                JSON.stringify({
                    error: error?.message,
                }),
                { status: status },
            );
        }
    }
}

export default function AppointmentHistory() {
    const { data, patientId } = useLoaderData<typeof loader>();
    return (
        <div>
            <HistoryTable data={data} patientId={patientId} />
        </div>
    );
}
