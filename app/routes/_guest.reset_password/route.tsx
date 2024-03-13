import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/cloudflare";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import ResetPasswordProcess, { ResetPasswordSchema } from "./resetpassword";
import { z } from "zod";
import { ResetPasswordApi } from "~/services/user";
import { useEffect } from "react";
import ToastDemo from "~/components/toatsdemo";

export async function loader({ request }: LoaderArgs) {
    try {
        const url = new URL(request.url);
        const resetToken = url.searchParams.get("token");

        return json(resetToken);
    } catch (error: any) {
        return json({ status: "400", message: "reset token not found" });
    }
}

export async function action({ request, context }: ActionArgs) {
    const body = await request.formData();
    const password = body.get("password");
    const confirm = body.get("confirm");
    const resetToken = body.get("resetToken");
    const userRaw = {
        password: password,
        confirm: confirm,
        resetToken: resetToken,
    };

    try {
        const user = ResetPasswordSchema.parse(userRaw);
        const result = await ResetPasswordApi(user, context);
        return json({ status: result.status, message: "Successfully" });
    } catch (error: any) {
        const status = error?.response?.status;
        if (error instanceof z.ZodError) {
            return json({ status: "validate", message: error.issues });
        }

        switch (status) {
            case 400:
                return json({ status: "400", message: "User not found" });
            default:
                return json({ status: "500", message: "Server error" });
        }
    }
}

export default function ResetPassword() {
    const resetToken = useLoaderData<typeof loader>();
    const data = useActionData<typeof action>();
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.status == "200") {
            var navigateOnSuccess = setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
        return () => {
            clearTimeout(navigateOnSuccess);
        };
    }, [data]);

    return (
        <div className="reset-pass-container ">
            <ResetPasswordProcess resetToken={resetToken ?? ""} data={data?.status != "validate" ? data : ""} error={data?.status == "validate" ? data : ""}  />
            {data?.status == "200" ? <ToastDemo message={"Reset password successfully"} /> : ""}
        </div>
    );
}
