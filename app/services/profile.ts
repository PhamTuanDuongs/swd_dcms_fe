import type { AppLoadContext } from "@remix-run/cloudflare";

import { api } from "./api";

import type { Avatar, Metadata, UserMetadata } from "~/types";

export async function getMetadata(context: AppLoadContext, userId: number) {
    return api(context)
        .get("api/user/" + userId)
        .json<Metadata>();
}

export const updateMetadata = async (context: AppLoadContext, user: UserMetadata, userId: number) => {
    const res = await api(context)
        .post("api/user/update", {
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
