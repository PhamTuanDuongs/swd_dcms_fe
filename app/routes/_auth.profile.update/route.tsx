import {
    ActionArgs,
    json,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
    unstable_composeUploadHandlers,
    AppLoadContext,
    redirect,
    V2_MetaFunction,
} from "@remix-run/cloudflare";
import { ShouldRevalidateFunction, useActionData, useNavigate, useRouteLoaderData } from "@remix-run/react";
import ky from "ky-universal";
import UpdateProfile from "./updateComponent";
import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import type { ProfileLoaderDataType } from "../_auth.profile/route";
import { Avatar, User, UserMetadata } from "~/types";
import { uploadImg } from "~/services/image";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { updateAvatar, updateMetadata } from "~/services/profile";
import { GetCurrentUser, UserCookie, requireAdmin, requireUser } from "~/utils/function/UserUtils";
import { getUserByNationalID } from "~/services/medstaff";

export const meta: V2_MetaFunction = () => {
    return [
        { title: "Edit Profile" },
        {
            property: "og:title",
            content: "Edit Profile",
        },
        {
            name: "description",
            content: "This app is the best",
        },
    ];
};
const ZUserMetadata = zfd.formData({
    name: zfd.text(
        z
            .string()
            .nonempty()
            .max(62)
            .regex(/^[a-zA-ZÀ-ỹ\s]+$/)
    ),
    dob: zfd.text(z.coerce.date().max(new Date())),
    address: zfd.text(z.string().trim().nonempty().max(126)),
    phoneNo: zfd.text(z.string().nonempty().max(30).regex(/^\d+$/)),
    gender: zfd.text().transform((val) => val == "true"),
    nationalId: zfd.text(z.string().nonempty().max(30).regex(/^\d+$/)),
    oldNationalId: zfd.text(z.string().nonempty()),
});

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

            return `${context.R2_URL}/${key}`;
        },
        // fallback to memory for everything else
        unstable_createMemoryUploadHandler()
    );

export async function action({ request, context }: ActionArgs) {
    await requireUser(request);
    const userCookie = (await GetCurrentUser(request)) as UserCookie;
    try {
        if (request.headers.get("content-type")?.includes("multipart/form-data")) {
            const formData = await unstable_parseMultipartFormData(request, uploadHandler(context));
            const url = formData.get("avatar");
            const id = userCookie.sub;
            const avatarUrl = {
                id,
                url,
            };
            await updateAvatar(context, avatarUrl as Avatar);
            return json({
                message: "Update successfully",
            });
        } else {
            const userMetadata = ZUserMetadata.parse(await request.formData());

            const { name, dob, nationalId, gender, address, phoneNo,oldNationalId } = userMetadata;

            const profileInfo = {
                email: "",
                metadata: {
                    name,
                    dob,
                    address,
                    phoneNo,
                    gender,
                    nationalId,
                },
            };
            const nationalIdExists = await getUserByNationalID(context, nationalId);
            if (nationalIdExists && oldNationalId !== nationalId) {
                return json({ status: 400, message: "This identification number has exited!" });
            }
            await updateMetadata(context, profileInfo, userCookie);
            return json({
                message: "Update successfully",
            });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return json({
                message: ("Update failed:" + JSON.stringify(error.issues)) as string,
            });
        }

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

export default function Update() {
    const user = useRouteLoaderData("routes/_auth.profile") as ProfileLoaderDataType;

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
                navigate("/profile");
            }, 10000);
        }
    }, [data]);

    return (
        <div>
            <div>{user && <UpdateProfile user={user as User} data={data as any} />}</div>
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
