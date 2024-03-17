import * as Tabs from "@radix-ui/react-tabs";
import { Form, Link, useNavigation } from "@remix-run/react";
import { z } from "zod";

import FormError from "~/components/formerror";
import Loading from "~/components/loadingspinner";

export const ResetPasswordSchema = z
    .object({
        password: z.string().trim().min(1, { message: "Password has to be filled." }).max(30, "Password must be below 30 character"),
        confirm: z.string().trim().min(1, { message: "Confirm password has to be filled." }).max(30, "Password must be below 30 character"),
        resetToken: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
        message: "Password and confirm password don't match",
        path: ["confirm"],
    });

export default function ResetPasswordProcess(props: any) {
    const transition = useNavigation();
    const active = transition.state !== "idle";
    return (
        <Tabs.Root
            className="flex m-20 justify-center flex flex-col w-[500px] h-[200px] shadow-[0_2px_10px] shadow-blackA4"
            defaultValue="tab2"
        >
            <Tabs.List className="shrink-0 flex border-b border-mauve6" aria-label="Manage your account">
                <Tabs.Trigger
                    className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                    value="tab2"
                >
                    Reset Password
                </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" value="tab2">
                <p className="mb-5 text-mauve11 text-[15px] leading-normal">Change your password here.</p>
                <Form method="POST" action={`/reset_password?token=${props?.resetToken}`}>
                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                        <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="newPassword">
                            Password
                            <i className="text-red-600">*</i>
                        </label>
                        <input
                            name="password"
                            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                            id="Password"
                            type="password"
                        />
                        <FormError error={props.error?.message} field="password" />
                    </fieldset>
                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                        <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="confirmPassword">
                            Confirm password
                            <i className="text-red-600">*</i>
                        </label>
                        <input
                            name="confirm"
                            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                            id="confirmPassword"
                            type="password"
                        />
                        <FormError error={props.error?.message} field="confirm" />
                    </fieldset>

                    <input value={props?.resetToken} name="resetToken" id="resetToken" type="hidden" />

                    <div className="flex justify-end mt-5">
                        <div>{active ? <Loading /> : ""}</div>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-green4 text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default"
                        >
                            Reset password
                        </button>
                    </div>
                    <div>
                        <h1 className="flex text-red-500 justify-center">{props?.data?.message}</h1>
                    </div>
                </Form>
            </Tabs.Content>
        </Tabs.Root>
    );
}
