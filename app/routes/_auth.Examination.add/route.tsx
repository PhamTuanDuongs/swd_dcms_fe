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
import { ShouldRevalidateFunction, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { HTTPError } from "ky";

import { AddExamination } from "./AddExamination";

import { AddNewExamination } from "~/services/examination";
import { uploadImg } from "~/services/image";
import { findAllUndeletedServicesByName } from "~/services/service";
import { Service } from "~/types";
import { requireAdmin } from "~/utils/function/UserUtils";

export const meta: MetaFunction = () => {
    return [
        { title: "Add Examination" },
        {
            property: "og:title",
            content: "Add Examination",
        },
        {
            name: "description",
            content: "This app is the best",
        },
    ];
};

export const shouldValidate: ShouldRevalidateFunction = ({ actionResult, currentUrl, defaultShouldRevalidate }) => {
    //  @ts-ignore
    return true;
    if (actionResult?.message == "Update successful") return true;

    return defaultShouldRevalidate;
};
const MAX_SIZE = 5 * 1024 * 1024;
const uploadHandler = (context: AppLoadContext) =>
    unstable_composeUploadHandlers(
        // our custom upload handler
        async ({ name, contentType, data, filename }) => {
            if (name !== "avatar" || !data) {
                return undefined;
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

            return `${context.cloudflare.env.R2_URL}/${key}`;
        },
        // fallback to memory for everything else
        unstable_createMemoryUploadHandler()
    );

export async function action({ request, context }: ActionFunctionArgs) {
    await requireAdmin(request);
    try {
        const formData = await unstable_parseMultipartFormData(request, uploadHandler(context));
        const url = formData.get("avatar");
        const service = formData.get("service");
        const result = formData.get("result");
        const examination = {
            appId: 1,
            imageResult: url,
            textResult: result,
            serviceId: service,
        };
        console.log(url);
        await AddNewExamination(context, examination as any);
        return json({
            message: "Add successfully",
        });
    } catch (error) {
        if (error instanceof Error)
            return json(
                {
                    message: ("Add failed: " + error.message) as string,
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
    const appId = url.searchParams.get("appId") as string;
    try {
        const getAllService = await findAllUndeletedServicesByName(context, 1);

        return json({ ...getAllService, appId });
    } catch (error) {
        if (error instanceof HTTPError) {
            if (error.response.status == 404) {
                return json({
                    currentPage: 0,
                    totalPage: 0,
                    services: [],
                    appId: "",
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

export default function Add() {
    const { services, appId } = useLoaderData<typeof loader>();
    const service = services as Service[];
    const data = useActionData<typeof action>() as any;
    const [open, setOpen] = React.useState(false);
    const eventDateRef = React.useRef(new Date());
    const timerRef = React.useRef(0);
    const timeoutRef = React.useRef<number | undefined>(undefined);
    const navigate = useNavigate();
    React.useEffect(() => {
        let timeoutId;
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
            timeoutId = setTimeout(() => {
                navigate("/examination?appId=" + appId);
            }, 10000);
        }
    }, [data]);

    return (
        <div>
            <AddExamination services={service} appId={appId} />
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
