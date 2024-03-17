import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { useActionData } from "@remix-run/react";
import { z } from "zod";

import ChangePasswordProcess, { ChangePasswordSchema } from "./changePassComponent";

import ToastDemo from "~/components/toatsdemo";
import { ChangePasswordApi } from "~/services/user";
import { GetCurrentUser, requireUser } from "~/utils/function/UserUtils";

export async function action({ request, context }: ActionFunctionArgs) {
    const body = await request.formData();
    const user = await GetCurrentUser(request);
    const confirm = body.get("confirm");
    const current = body.get("current");
    const password = body.get("password");

    if (user == null) {
        return redirect("/change_password");
    }

    try {
        const userChange = ChangePasswordSchema.parse({ password, confirm, current, id: user.sub });
        const userSubmit = { ...userChange, id: user.sub };
        const result = await ChangePasswordApi(userSubmit, context);
        return json({ status: result.status, message: await result.text() });
    } catch (error: any) {
        const status = error?.response?.status;
        if (error instanceof z.ZodError) {
            return redirect("/change_password");
        }

        switch (status) {
            case 400:
                return json({ status: "400", message: "Current password don't match" });
            default:
                return json({ status: "500", message: "Server error" });
        }
    }
}

export default function ChangePassword() {
    const data = useActionData<typeof action>();
    return (
        <div>
            <ChangePasswordProcess data={data?.status != "validate" ? data : ""} />
            {data?.status == "200" ? <ToastDemo message={"Change password successfully"} /> : ""}
        </div>
    );
}
