import * as Tabs from "@radix-ui/react-tabs";
import { Form, Link, useNavigation } from "@remix-run/react";
import { z } from "zod";

import FormError from "~/components/formerror";
import Loading from "~/components/loadingspinner";

export const LoginSchema = z.object({
    email: z
        .string()
        .email("This is not a valid email.")
        .min(1, { message: "Email has to be filled." })
        .max(254, { message: "The email cannot have more than 254 character." })
        .trim(),
    password: z.string().min(1, { message: "Password has to be filled." }).max(30, "Password must be below 30 character").trim(),
});

const LoginForm = (props: any) => {
    const transition = useNavigation();
    const active = transition.state !== "idle";

    return (
        <Tabs.Root className="m-20 justify-center flex flex-col w-[500px] shadow-[0_2px_10px] shadow-blackA4" defaultValue="tab1">
            <Tabs.List className="shrink-0 flex border-b border-mauve6" aria-label="Manage your account">
                <Tabs.Trigger
                    className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                    value="tab1"
                >
                    Login
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" value="tab1">
                <Form method="POST" action="/login">
                    <p className="mb-5 text-mauve11 text-[15px] leading-normal">Sign in</p>
                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                        <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="name">
                            Email
                        </label>
                        <input
                            name="email"
                            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                            id="name"
                            defaultValue=""
                        />
                        <FormError error={props.error?.message} field="email" />
                    </fieldset>
                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                        <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="password">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                            id="password"
                            defaultValue=""
                        />

                        <FormError error={props.error?.message} field="password" />
                    </fieldset>
                    <div className="flex justify-end mt-5">
                        <div>{active ? <Loading /> : ""}</div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-green4 text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default"
                        >
                            Login
                        </button>
                    </div>

                    <div>
                        <h1 className="flex justify-center text-red-500">{props.message}</h1>
                    </div>
                </Form>

                <a
                    className="hover:text-violet11 text-mauve11"
                    href="https://accounts.google.com/o/oauth2/auth?scope=email&redirect_uri=http://localhost:8080/login-google&response_type=code
    &client_id=866882526701-onj62v6cemkab5987vn7lubi0mg7bimt.apps.googleusercontent.com&approval_prompt=force"
                >
                    Login With Gmail
                </a>
                <div>
                    <span>Don't have an account? </span>
                    <Link
                        to="/signup"
                        className="bg-white  h-[45px] inline-flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none "
                    >
                        Signup
                    </Link>
                </div>

                <div>
                    <span>Forget password? </span>
                    <Link
                        to="/forget"
                        className="bg-white  h-[30px] inline-flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none "
                    >
                        Reset password
                    </Link>
                </div>
            </Tabs.Content>
        </Tabs.Root>
    );
};

export default LoginForm;
