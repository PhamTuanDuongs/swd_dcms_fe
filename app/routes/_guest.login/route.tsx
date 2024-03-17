import { useEffect } from "react";
import { type ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { z } from "zod";

import ToastDemo from "~/components/toatsdemo";
import LoginForm, { LoginSchema } from "~/routes/_guest.login/LoginComponent";
import { GetLogin } from "~/services/user";
import { userCookie } from "~/utils/function/UserCookie";

export async function action({ request, context }: ActionFunctionArgs) {
    const body = await request.formData();
    const email = body.get("email");
    const password = body.get("password");
    const userRaw = { email: email, password: password };
    try {
        const user = LoginSchema.parse(userRaw);
        const jsonData = await GetLogin(user, context);

        return json({ status: "200", message: "Login succesfully" }, { headers: { "Set-Cookie": await userCookie.serialize(jsonData) } });
    } catch (error: any) {
        const status = error?.response?.status;
        if (error instanceof z.ZodError) {
            return json({ status: "validate", message: error.issues });
        }

        switch (status) {
            case 400:
                return json({ status: "400", message: "Incorrect email or password" });

            case 500:
                return json({ status: "500", message: "Server error" });

            default:
                return json({ status: "500", message: "Failed to login" });
        }
    }
}

export async function loader({ request }: ActionFunctionArgs) {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    if (token != null) {
        return json({ status: "200", message: "Login succesfully" }, { headers: { "Set-Cookie": await userCookie.serialize(token) } });
    }
    return json({ status: "not login", message: "" });
}

export default function Login() {
    const navigate = useNavigate();
    const data = useActionData<typeof action>();
    const token = useLoaderData<typeof loader>();

    useEffect(() => {
        if (data?.status == "200" || token?.status == "200") {
            navigate("/appointment");
        }
        return () => {};
    }, [data, token, navigate]);

    return (
        <div className="login-container">
            <LoginForm message={data?.status != "validate" ? data?.message : ""} error={data?.status == "validate" ? data : ""} />
            {data?.status == "200" || token?.status == "200" ? <ToastDemo message={"Login Successfully"} /> : ""}
        </div>
    );
}
