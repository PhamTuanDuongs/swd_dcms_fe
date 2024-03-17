import React from "react";
import * as Toast from "@radix-ui/react-toast";
import {
    ActionFunctionArgs,
    AppLoadContext,
    json,
    LoaderFunctionArgs,
    MetaFunction,
    unstable_composeUploadHandlers,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { HTTPError } from "ky";

import { UpdateExamination } from "./UpdateExamination";

import { GetExaminationById, UpdateExaminationById, UpdateImageExameById } from "~/services/examination";
import { uploadImg } from "~/services/image";
import { findAllUndeletedServicesByName } from "~/services/service";
import { type Examination, type Service } from "~/types";
import { requireAdmin } from "~/utils/function/UserUtils";
export const meta: MetaFunction = () => {
    return [{ title: "Edit Examination" }];
};

const MAX_SIZE = 5 * 1024 * 1024;
const uploadHandler = (context: AppLoadContext) =>
    unstable_composeUploadHandlers(
        // our custom upload handler
        async ({ name, contentType, data, filename }) => {
            if (name !== "avatar" || !data) {
                return;
            }

            const imgChunks = [];
            for await (const chunk of data) {
                imgChunks.push(chunk);
            }

            const img = new File(imgChunks, filename as string, { type: contentType });
            if (img.size > MAX_SIZE) {
                throw new Error("The image size is greater than 5MB.");
            }
            const allowedContentTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

            if (!allowedContentTypes.includes(contentType)) {
                throw new Error("Content type '" + contentType + "' is not allowed in this file.");
            }

            const key = Math.random().toString(36).substring(2, 15);
            await uploadImg(key, context, img, contentType);

            return `${context.R2_URL}/${key}`;
        },
        // fallback to memory for everything else
        unstable_createMemoryUploadHandler()
    );

export async function action({ request, context }: ActionFunctionArgs) {
    await requireAdmin(request);
    try {
        if (request.headers.get("content-type")?.includes("multipart/form-data")) {
            const formData = await unstable_parseMultipartFormData(request, uploadHandler(context));
            const urlImage = formData.get("avatar");
            const examid = formData.get("id");
            const examination = {
                id: examid,
                imageResult: urlImage,
            };
            await UpdateImageExameById(context, examination as any);
            return json({
                message: "Update successfully",
            });
        } else {
            const formData = await request.formData();
            const service = formData.get("service");
            const result = formData.get("result");
            const examid = formData.get("id");
            console.log(service);
            console.log(result);
            console.log(examid);
            const examination = {
                id: examid,
                appId: 0,
                imageResult: "",
                textResult: result,
                serviceId: service,
            };
            await UpdateExaminationById(context, examination as any);
            return json({
                message: "Update successfully",
            });
        }
    } catch (error) {
        if (error instanceof Error)
            return json(
                {
                    message: ("Update failed: " + error.message) as string,
                },
                {
                    status: 400,
                }
            );
    }
}

export async function loader({ context, request }: LoaderFunctionArgs) {
    await requireAdmin(request);
    const url = new URL(request.url);
    const path = url.pathname;
    const pathParts = path.split("/");
    const examId = pathParts[2];
    try {
        const getAllService = await findAllUndeletedServicesByName(context, 1);
        const getExamination = await GetExaminationById(context, parseInt(examId));
        return json({ ...getAllService, getExamination });
    } catch (error) {
        if (error instanceof HTTPError) {
            if (error.response.status == 404) {
                return json({
                    currentPage: 0,
                    totalPage: 0,
                    services: [],
                    getExamination: "",
                });
            }

            throw new Response(
                JSON.stringify({
                    error: error?.message,
                }),
                { status: error?.response?.status ?? 500 }
            );
        }

        throw json(
            {
                error: "Unknown error",
            },
            {
                status: 500,
            }
        );
    }
}

export default function Update() {
    const { services, getExamination } = useLoaderData<typeof loader>();
    const examination = getExamination as Examination;
    const service = services as Service[];
    const data = useActionData<typeof action>() as any;
    const [open, setOpen] = React.useState(false);
    const eventDateRef = React.useRef(new Date());
    const timerRef = React.useRef(0);
    const timeoutRef = React.useRef<number | undefined>(undefined);
    const navigate = useNavigate();
    React.useEffect(() => {
        if (data?.message) {
            if (data?.message === "This identification number has exited!") {
                return;
            }
            setOpen(false);
            clearTimeout(timerRef.current);
            timeoutRef.current = window.setTimeout(() => {
                eventDateRef.current = oneWeekAway();
                setOpen(true);
            }, 100);
        }

        if (data?.message) {
            if (data?.message === "This identification number has exited!") {
                return;
            }
            setTimeout(() => {
                navigate("/examination?appId=");
            }, 10000);
        }
    }, [data]);

    return (
        <div>
            <h1 className="mx-8 my-8 text-3xl font-semibold text-gray-900 dark:text-white">Edit Examination Results</h1>
            <UpdateExamination services={service} examination={examination} />
            <Toast.Provider swipeDirection="right">
                <Toast.Toast
                    className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
                    open={open}
                    onOpenChange={setOpen}
                >
                    <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">{data?.message}</Toast.Title>
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
