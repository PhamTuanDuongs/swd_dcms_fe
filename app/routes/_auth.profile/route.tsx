import type { LoaderFunctionArgs, TypedResponse } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";

import { getMetadata } from "~/services/profile";
import type { User } from "~/types";
import { requireUser } from "~/utils/function/UserUtils";

export function shouldRevalidate() {
    return true;
}

export async function loader({ context, request }: LoaderFunctionArgs) {
    const user = await requireUser(request);

    try {
        const metadata = await getMetadata(context, user.id);

        if (!metadata) throw new Response("Metadata not found", { status: 403, statusText: "Internal server error" });

        return json(metadata);
    } catch (error) {
        throw new Response("Internal server error", { status: 500, statusText: "Internal server error" });
    }
}

export type ProfileLoaderDataType = User | TypedResponse<never> | undefined;

const ProfileLayout = () => <Outlet />;

export default ProfileLayout;
