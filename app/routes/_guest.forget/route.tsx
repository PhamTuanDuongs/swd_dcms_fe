import { ActionArgs, json } from "@remix-run/cloudflare";
import ProcessForget, { ForgetSchema } from "./Forget";
import { string, z } from "zod";
import { GetResetPasswordToken } from "~/services/user";
import { useActionData } from "@remix-run/react";

export async function action({ request, context }: ActionArgs) {
    const body = await request.formData();
    const emailRaw = body.get("email");
    try {
        const email = ForgetSchema.parse({ email: emailRaw });
        const message = await GetResetPasswordToken(email, context);
        return json({ status: 200, message: "Sending email succesfully " });
    } catch (error: any) {
        const status = error?.response?.status;
        if (error instanceof z.ZodError) {
            return json({ status: "validate", message: error.issues });
        }

        switch (status) {
            case 400:
                return json({ status: "400", message: "Email doesn't existed" });

            case 500:
                return json({ status: "500", message: "Server error" });

            default:
                return json({ status: "500", message: "Failded to send email" });
        }
    }
}

export default function ForgetPassword() {
    const data = useActionData<typeof action>();

    return (
        <div>
            <ProcessForget message={data?.status != "validate" ? data?.message : ""} error={data?.status == "validate" ? data : ""} />
        </div>
    );
}
