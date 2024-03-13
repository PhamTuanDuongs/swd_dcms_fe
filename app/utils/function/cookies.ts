import { createCookie } from "@remix-run/cloudflare";

export const userPref = createCookie("token", {
    maxAge: 4 * 3600, // one week
});
