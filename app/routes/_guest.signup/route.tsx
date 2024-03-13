import { ActionArgs, json } from "@remix-run/cloudflare";
import { useActionData, useNavigate } from "@remix-run/react";
import ky from "ky-universal";
import { useEffect } from "react";
import { z } from "zod";
import ToastDemo from "~/components/toatsdemo";
import RegisterForm, { SignupSchema } from "./signup";
import { RegisterUser } from "~/services/user";

export async function action({ request, context }: ActionArgs) {
    const body = await request.formData();

    const email = body.get("email");
    const password = body.get("password");
    const confirm = body.get("confirm");
    const name = body.get("name");
    const dob = body.get("dob");
    const address = body.get("address");
    const gender = body.get("gender");
    const nationalId = body.get("nationalId");
    const userRaw = {
        email: email,
        password: password,
        confirm: confirm,
        name: name,
        dob: dob,
        address: address,
        gender: gender == null ? null : gender == "1",
        nationalId: nationalId,
    };

    // const user = {
    //     email: email,
    //     password: password,
    //     confirm: confirm,
    //     metadata: {
    //         name: name,
    //         dob: dob,
    //         address: address,
    //         gender: gender == "1",
    //         nationalId: nationalId,
    //     },
    // };

    try {
        const userChecked = SignupSchema.parse(userRaw);
        const user = {
            email: userChecked.email,
            password: userChecked.password,
            confirm: userChecked.confirm,
            metadata: {
                name: userChecked.name,
                dob: userChecked.dob,
                address: userChecked.address,
                gender: gender == "1",
                nationalId: userChecked.nationalId,
            },
        };

        const result = await RegisterUser(user, context);
    } catch (error: any) {
        const status = error?.response?.status;
        if (error instanceof z.ZodError) {
            return json({ status: "validate", message: error.issues });
        }
        switch (status) {
            case 400:
                return json({ status: "400", message: "Email has been used" });
            default:
                return json({ status: "500", message: "Server error" });
        }
    }
    return json({ status: "200", message: "Sign up succefully" });
}

export default function Register() {
    const data: any = useActionData<typeof action>();
    const navigate = useNavigate();
    useEffect(() => {
        if (data?.status == "200") {
            var navigateOnSuccess = setTimeout(() => {
                navigate("/");
            }, 2000);
        }
        return () => {
            clearTimeout(navigateOnSuccess);
        };
    }, [data]);

    return (
        <div className="signup-container">
            <RegisterForm data={data?.status != "validate" ? data : ""} error={data?.status == "validate" ? data : ""} />
            {data?.status == "200" ? <ToastDemo message={"Sign up successfully"} /> : ""}
        </div>
    );
}
