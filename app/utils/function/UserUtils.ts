import ky from "ky-universal";
import { userCookie } from "./UserCookie";
import { redirect } from "@remix-run/cloudflare";
export async function GetUserToken({ email, password }: any) {
    const user = { email: email, password: password };
    const jsonData = await ky
        .post("http://localhost:8080/api/login", {
            json: user,
        })
        .text();
    return jsonData;
}

export async function GetCurrentUser(request: Request) {
    const cookieHeader = request.headers.get("Cookie");
    const  token  = (await userCookie.parse(cookieHeader)) || "Cookie Error";
    try {
        if (token == undefined || token == null) {
            return null;
        }
        var tokens = token.split(".");
        return JSON.parse(atob(tokens[1])) as UserCookie;
    } catch (error) {
    }
    return null;
}

export async function requireUser(request : Request) {
    try {
        const user = await GetCurrentUser(request);
        if(user == null) {
            throw redirect("/login")
        }
    } catch (error) {
        throw error
    }
}

export async function requireAdmin(request : Request) {
    try {
        const user = await GetCurrentUser(request);
        if(user == null) {
            throw redirect("/")
        } else if(user.role.toLocaleLowerCase() !== "admin") {
            throw redirect("/")
        }
    } catch (error) {
        throw error
    }
}

export interface UserCookie {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}
