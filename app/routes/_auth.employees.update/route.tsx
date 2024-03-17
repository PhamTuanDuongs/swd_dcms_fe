import React from "react";
import * as Toast from "@radix-ui/react-toast";
import { ActionFunction, ActionFunctionArgs, json, LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";

import UpdateEmployee from "./updateComponent";

import { getEmployees, getEmployeesById, getUserByNationalID, updateMedStaff } from "~/services/medstaff";
import { getAllRoleEmployee } from "~/services/role";
import { MedstaffMetadata, Role } from "~/types";
import { requireAdmin } from "~/utils/function/UserUtils";

export async function loader({ context, request }: LoaderFunctionArgs) {
    // await requireAdmin(request);
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    try {
        const medstaff = await getEmployeesById(id, context);
        // const role = await getAllRoleEmployee(context);
        if (medstaff == undefined) throw new Response("Metadata not found", { status: 403, statusText: "Internal server error" });
        return json(medstaff);
    } catch (error) {
        console.log(error);
        throw new Response("Internal server error", { status: 500, statusText: "Internal server error" });
    }
}

export const action: ActionFunction = async ({ context, request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id") as string;
    const formData = await request.formData();
    const name = await formData.get("name");
    const dob = await formData.get("dob");
    const nationalId = await formData.get("nationalId");
    const gender = await formData.get("gender");
    const address = await formData.get("address");
    const phoneNo = await formData.get("phoneNo");
    const quanlification = await formData.get("quanlification");
    const experience = await formData.get("experience");

    const medstaff = {
        id: id,
        quanlification: quanlification,
        experience: experience,
        user: {
            name: name,
            dob: dob,
            nationalId: nationalId,
            gender: gender,
            address: address,
            phoneNo: phoneNo,
        },
    };

    try {
        await updateMedStaff(context, medstaff);
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

export const meta: MetaFunction = () => {
    return [{ title: "Edit Employee" }];
};

export default function Update() {
    const data = useLoaderData<typeof loader>();
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
                navigate("/employees");
            }, 10000);
        }
    }, [status]);

    return (
        <div>
            {data && <UpdateEmployee medstaff={data} />}
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
