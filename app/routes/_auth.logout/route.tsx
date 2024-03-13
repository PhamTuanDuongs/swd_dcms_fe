import { redirect } from "@remix-run/cloudflare";
import { userCookie } from "~/utils/function/UserCookie";

export const loader = async () => {
    return redirect("/", {
        headers: {
            "Set-Cookie": await userCookie.serialize("", {
                expires: new Date(0),
            }),
        },
    });
};
