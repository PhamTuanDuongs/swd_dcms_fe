import { type ActionArgs, type LoaderArgs, json } from "@remix-run/cloudflare";
import AppointmentDetailComponent from "./AppointmentDetailComponent";
import { ApproveAppointment, CancleAppointment, GetAppointmentDetail } from "~/services/appointment";
import { GetCurrentUser, requireUser } from "~/utils/function/UserUtils";
import { HTTPError } from "ky-universal";
import { useActionData, useLoaderData, Outlet, Link } from "@remix-run/react";
import { ToastMessage } from "./Toast";
import { Feedback } from "./FeedbackComponent";
import { AddFeedBack, FeedbackObject } from "~/services/feedback";

export async function loader({ request, context, params }: LoaderArgs) {
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


export async function action({ request, context }: ActionArgs) {
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

    if (request.method == "PUT") {
        try {

            const doctorPoint = parseInt(body.get("doctorPoint")?.toString() || "0");
            const appointmentPoint = parseInt(body.get("appointmentPoint")?.toString() || "0");
            const comment = body.get("comment")?.toString() || "";
            const feedback: FeedbackObject = {
                doctorPoint,
                appointmentPoint,
                comment,
            }
            const result = await AddFeedBack(feedback, id, context)
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
    const { data, user } : any = useLoaderData<typeof loader>();
    const status = useActionData<typeof action>();

    return (
        <div>
            <div className="grid grid-cols-5 mx-2">
                <div className="col-span-4">
                    <div className="flex space-x-10">
                        <div>
                            <Link to="." className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded block m-3 w-full">
                                Overview
                            </Link>
                        </div>
                        <div>
                            <Link
                                to="examination"
                                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded block m-3 w-full"
                            >
                                Examination Result
                            </Link>
                        </div>

                        <div>
                            <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded block m-3 w-full">
                                Prescription
                            </button>
                        </div>

                        <div>
                            <Feedback feedback={data?.feedback} user={user.role} appointmentId={data.id} />
                        </div>
                    </div>
                </div>
            </div>

            <Outlet />
        </div>
    );
}
