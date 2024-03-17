import type { AppLoadContext } from "@remix-run/cloudflare";

import { api } from "./api";

export async function GetLogin({ email, password }: any, context: AppLoadContext) {
    const user = { email: email, password: password };

    return await api(context)
        .post("api/login", {
            json: user,
        })
        .text();
}

export async function RegisterUser(user: any, context: AppLoadContext) {
    return await api(context).post("api/register", { json: user }).text();
}

export async function GetResetPasswordToken(user: any, context: AppLoadContext) {
    return await api(context).post("api/forgot-pass", { json: user, timeout: false });
}

export async function ResetPasswordApi(user: any, context: AppLoadContext) {
    const fomrData = new FormData();
    fomrData.append("password", user.password);
    fomrData.append("resetToken", user.resetToken);
    return await api(context).post("api/reset-pass", {
        body: fomrData,
        timeout: false,
    });
}

export async function ChangePasswordApi(user: any, context: AppLoadContext) {
    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("newPassword", user.password);
    formData.append("currentPassword", user.current);
    return await api(context).post("api/user/change-pass", {
        body: formData,
    });
}
