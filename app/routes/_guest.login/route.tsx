import { useEffect } from "react";
import { type ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { useActionData, useNavigate } from "@remix-run/react";
import { HTTPError } from "ky";
import { z } from "zod";

import ToastDemo from "~/components/toatsdemo";
import LoginForm, { LoginSchema } from "~/routes/_guest.login/LoginComponent";
import { GetLogin } from "~/services/user";
import { userCookie } from "~/utils/function/UserCookie";
import { GetCurrentUser } from "~/utils/function/UserUtils";

export async function action({ request, context }: ActionFunctionArgs) {
    const body = await request.formData();
    const email = body.get("email");
    const password = body.get("password");
    const userRaw = { email: email, password: password };
    try {
        const user = LoginSchema.parse(userRaw);
        const loggedUser = await GetLogin(user, context);

        return json({ status: "200", message: "Login succesfully" }, { headers: { "Set-Cookie": await userCookie.serialize(loggedUser) } });
    } catch (error) {
        if (error instanceof HTTPError) {
            switch (error?.response?.status) {
                case 400:
                    return json({ status: "400", message: "Incorrect email or password" });

                case 500:
                    return json({ status: "500", message: "Server error" });

                default:
                    return json({ status: "500", message: "Failed to login" });
            }
        }

        if (error instanceof z.ZodError) {
            return json({ status: "validate", message: error.issues });
        }
    }
}

export async function loader({ request }: ActionFunctionArgs) {
    const user = await GetCurrentUser(request);

    if (user) redirect("/appointment");

    return null;
}

export default function Login() {
    const navigate = useNavigate();
    const data = useActionData<typeof action>();

    useEffect(() => {
        if (data?.status == "200") {
            navigate("/appointment");
        }
    }, [data, navigate]);

    return (
        <div className="login-container">
            <LoginForm message={data?.status != "validate" ? data?.message : ""} error={data?.status == "validate" ? data : ""} />
            {data?.status == "200" ? <ToastDemo message={"Login Successfully"} /> : ""}
        </div>
    );
}
