import { json } from "@remix-run/cloudflare";
import type { LoaderArgs, TypedResponse } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { getMetadata } from "~/services/profile";
import type { User } from "~/types";
import { GetCurrentUser, UserCookie, requireUser } from "~/utils/function/UserUtils";

export function shouldRevalidate() {
    return true;
}

export async function loader({ context, request }: LoaderArgs) {
    await requireUser(request);
    try {
        const userId = (await GetCurrentUser(request)) as UserCookie;

        const metadata = await getMetadata(context, userId);

        if (metadata == undefined) throw new Response("Metadata not found", { status: 403, statusText: "Internal server error" });

        return json(metadata);
    } catch (error) {
        throw new Response("Internal server error", { status: 500, statusText: "Internal server error" });
    }
}

export type ProfileLoaderDataType = User | TypedResponse<never> | undefined;

const ProfileLayout = () => <Outlet />;

export default ProfileLayout;
