import type { AppLoadContext } from "@remix-run/cloudflare";
import ky from "ky";

export const api = (context: AppLoadContext) => {
    if (!context.SPRING_URL) {
        throw new Error("SPRING_URL is not defined");
    }

    return ky.create({ prefixUrl: context.SPRING_URL as string });
};
