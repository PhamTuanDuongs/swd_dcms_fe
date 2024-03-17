import { createCookie } from "@remix-run/cloudflare";

export const userCookie = createCookie("token", {
    secure: false,
});
