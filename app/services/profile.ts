import type { AppLoadContext } from "@remix-run/cloudflare";
import type { Avatar, User, UserMetadata } from "~/types";
import { api } from "./api";
import { UserCookie } from "~/utils/function/UserUtils";
export async function getMetadata(context: AppLoadContext, userCookie: UserCookie) {
    try {
        const json = await api(context)
            .get("api/users/" + userCookie.sub)
            .json<User>();

        return json;
    } catch (error) {
        throw error;
    }
}

export const updateMetadata = async (context: AppLoadContext, user: UserMetadata, userCookie: UserCookie) => {
    try {
        const res = await api(context)
            .post("api/users/update/" + userCookie.sub, {
                json: user,
            })
            .text();
        return res;
    } catch (error) {
        throw error;
    }
};

export const updateAvatar = async (context: AppLoadContext, avatarUrl: Avatar) => {
    try {
        const res = await api(context)
            .post("api/users/avatar", {
                json: avatarUrl,
            })
            .text();
        return res;
    } catch (error) {
        throw error;
    }
};
