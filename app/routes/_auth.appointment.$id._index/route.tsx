import { type ActionFunctionArgs, json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useActionData, useLoaderData } from "@remix-run/react";
import { HTTPError } from "ky";

import AppointmentDetailComponent from "./AppointmentDetailComponent";
import { ToastMessage } from "./Toast";

import { ApproveAppointment, CancleAppointment, GetAppointmentDetail } from "~/services/appointment";
import { GetCurrentUser, requireUser } from "~/utils/function/UserUtils";

export async function loader({ request, context, params }: LoaderFunctionArgs) {
    await requireUser(request);
    try {
        const user = await GetCurrentUser(request);
        const data = await GetAppointmentDetail(params?.id, context, request);
        return { data, user };
    } catch (error) {
        if (error instanceof HTTPError) {
            const status = error.response.status;
            throw new Response(
                JSON.stringify({
                    error: error?.message,
                }),
                { status: status }
            );
        }
    }
}

export async function action({ request, context }: ActionFunctionArgs) {
    const body = await request.formData();
    const id = body.get("id") as string;
    if (request.method == "DELETE") {
        try {
            await CancleAppointment(parseInt(id), context);
            return json({
                message: "Cancel appointment successfully",
            });
        } catch {
            return json(
                {
                    message: "Failed to cancel appointment",
                },
                {
                    status: 400,
                }
            );
        }
    }

    if (request.method == "POST") {
        try {
            if (!id) {
                throw Error("Id is not correct");
            }
            const result = await ApproveAppointment(parseInt(id), context);
            return json({
                message: result,
            });
        } catch (error) {
            if (error instanceof HTTPError) {
                return json({
                    message: await error.response.text(),
                });
            }
        }
    }
}
export default function AppointmentDetail() {
    const { data, user } = useLoaderData<typeof loader>();
    const status = useActionData<typeof action>();
    return (
        <div>
            <AppointmentDetailComponent data={data} user={user} />;
            <ToastMessage status={status} />
            {/* <Outlet /> */}
        </div>
    );
}
