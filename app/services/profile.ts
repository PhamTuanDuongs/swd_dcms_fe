import type { AppLoadContext } from "@remix-run/cloudflare";

import { api } from "./api";

import type { Avatar, User, UserMetadata } from "~/types";
import { UserCookie } from "~/utils/function/UserUtils";
export async function getMetadata(context: AppLoadContext, userCookie: UserCookie) {
    const json = await api(context)
        .get("api/users/" + userCookie.sub)
        .json<User>();

    return json;
}

export const updateMetadata = async (context: AppLoadContext, user: UserMetadata, userCookie: UserCookie) => {
    const res = await api(context)
        .post("api/users/update/" + userCookie.sub, {
            json: user,
        })
        .text();
    return res;
};

export const updateAvatar = async (context: AppLoadContext, avatarUrl: Avatar) => {
    const res = await api(context)
        .post("api/users/avatar", {
            json: avatarUrl,
        })
        .text();
    return res;
};
