import type { AppLoadContext } from "@remix-run/cloudflare";

import { api } from "./api";

import type { Avatar, Metadata, User, UserMetadata } from "~/types";
import { UserCookie } from "~/utils/function/UserUtils";
// export async function getMetadata(context: AppLoadContext, userCookie: UserCookie) {
//     const json = await api(context)
//         // .get("api/users/" + userCookie.sub)
//         .get("api/user/1")
//         .json<User>();
//     console.log(json);
//     return json;
// }
export async function getMetadata(context: AppLoadContext, userId: number) {
  const json = await api(context)
    .get("api/user/1")
    .json<Metadata>();

  return json;
}

// export const updateMetadata = async (context: AppLoadContext, user: UserMetadata, userCookie: UserCookie) => {
//
//   const res = await api(context)
//         // .post("api/user/update/" + userCookie.sub, {
//         .post("api/user/update",{
//             json: user,
//         })
//         .text();
//     return res;
// };
export const updateMetadata = async (context: AppLoadContext, user: UserMetadata, userId: number) => {
  const res = await api(context)
    // .post("api/user/update/" + userCookie.sub, {
    .post("api/user/update",{
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
