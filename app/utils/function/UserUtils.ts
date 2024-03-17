import { redirect } from "@remix-run/cloudflare";
import ky from "ky";

import { userCookie } from "./UserCookie";

import { User } from "~/types";

export async function GetUserToken({ email, password }: any) {
    const user = { email: email, password: password };
    const jsonData = await ky
        .post("http://localhost:8080/api/login", {
            json: user,
        })
        .text();

    return jsonData;
}

export async function GetCurrentUser(request: Request): Promise<User | null> {
    const cookieHeader = request.headers.get("Cookie");
    return userCookie.parse(cookieHeader);
}

export async function requireUser(request: Request) {
    const user = await GetCurrentUser(request);

    if (!user) {
        throw redirect("/login");
    }

    return user;
}

export async function requireAdmin(request: Request) {
    const user = await requireUser(request);

    if (user.role.roleName.toLowerCase() !== "admin") {
        throw redirect("/");
    }

    return user;
}

export interface UserCookie {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}
