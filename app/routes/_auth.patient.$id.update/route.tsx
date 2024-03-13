import { ActionArgs, ActionFunction, LoaderArgs, V2_MetaFunction, json } from "@remix-run/cloudflare";
import React from "react";
import { requireAdmin } from "~/utils/function/UserUtils";
import UpdatePatient from "./update";
import { getPatientById, updatePatient } from "~/services/patient";
import { useActionData, useLoaderData, useNavigate, useRouteLoaderData } from "@remix-run/react";
import { zfd } from "zod-form-data";
import * as Toast from "@radix-ui/react-toast";
import { z } from "zod";
import { Metadata } from "~/types";
import { getUserByNationalID } from "~/services/medstaff";

const ZUserMetadata = zfd.formData({
    name: zfd.text(
        z
            .string()
            .nonempty()
            .max(62)
            .regex(/^[a-zA-ZÀ-ỹ\s]+$/)
    ),
    dob: zfd.text(z.coerce.date().max(new Date())),
    address: zfd.text(z.string().nonempty().max(126)),
    phoneNo: zfd.text(z.string().nonempty().max(30).regex(/^\d+$/)),
    gender: zfd.text().transform((val) => val == "true"),
    nationalId: zfd.text(z.string().nonempty().max(30).regex(/^\d+$/)),
    oldNationalId: zfd.text(z.string().nonempty()),
});



export async function loader({ context, request,params }: LoaderArgs) {
    await requireAdmin(request);
    const id = params?.id;

    try {
        const patient = await getPatientById(id, context);
        if (patient == undefined) throw new Response("Patient not found", { status: 403, statusText: "Internal server error" });
        return json({
            patient
        });
    } catch (error) {
        throw new Response("Internal server error", { status: 500, statusText: "Internal server error" });
    }
}

export const action: ActionFunction = async ({ context, request,params }) => {
    const id = params?.id;

    try {
        const userMetadata = ZUserMetadata.parse(await request.formData());
        const { name, dob, address, phoneNo, gender, nationalId, oldNationalId } = userMetadata;
        const patientInfo = {
            id: id,
            name,
            dob,
            address,
            phoneNo,
            gender,
            nationalId,
        };
        const nationalIdExists = await getUserByNationalID(context, nationalId);
        if (nationalIdExists && oldNationalId != nationalId) {
            return json({ status: 400, message: "This identification number has exited!" });
        }
        await updatePatient(context, patientInfo);
        return json({
            message: "Update successfully",
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return json({
                message: ("Updates failed:" + JSON.stringify(error.issues)) as string,
            });
        }
        return json(
            {
                message: ("Update failed: " + JSON.stringify(error)) as string,
            },
            {
                status: 400,
            }
        );
    }
};

export const meta: V2_MetaFunction = () => {
    return [{ title: "Edit Patient" }];
};

export default function Update() {
    const data = useLoaderData<typeof loader>();
    const patient = data.patient as Metadata;
    const status = useActionData<typeof action>();
    const [open, setOpen] = React.useState(false);
    const eventDateRef = React.useRef(new Date());
    const timerRef = React.useRef(0);
    const timeoutRef = React.useRef<number | undefined>(undefined);
    const navigate = useNavigate();
    React.useEffect(() => {
        let timeoutId;
        if (status?.message) {
            if (status?.message === "This identification number has exited!") {
                return;
            }
            setOpen(false);
            clearTimeout(timerRef.current);
            timeoutRef.current = window.setTimeout(() => {
                eventDateRef.current = oneWeekAway();
                setOpen(true);
            }, 100);
        }

        if (status?.message) {
            if (status?.message === "This identification number has exited!") {
                return;
            }
            timeoutId = setTimeout(() => {
                navigate("/patient");
            }, 10000);
        }
    }, [status]);

    return (
        <div>
            {patient && <UpdatePatient patient={patient} data={status} />}
            <Toast.Provider swipeDirection="right">
                <Toast.Toast
                    className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
                    open={open}
                    onOpenChange={setOpen}
                >
                    <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                        {status?.message}
                    </Toast.Title>
                    <Toast.Description asChild>
                        <time
                            className="[grid-area:_description] m-0 text-slate11 text-[13px] leading-[1.3]"
                            dateTime={eventDateRef.current.toISOString()}
                        >
                            {prettyDate(eventDateRef.current)}
                        </time>
                    </Toast.Description>
                </Toast.Toast>
                <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
            </Toast.Provider>
        </div>
    );
}
function oneWeekAway() {
    const now = new Date();
    return now;
}

function prettyDate(date: any) {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(date);
}
