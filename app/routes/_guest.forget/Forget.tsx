import * as Tabs from "@radix-ui/react-tabs";
import { Form, Link, useNavigation } from "@remix-run/react";
import Loading from "~/components/loadingspinner";
import { z } from "zod";
import FormError from "~/components/formerror";

export const ForgetSchema = z.object({
    email: z
        .string()
        .trim()
        .email("This is not a valid email.")
        .min(1, { message: "Email has to be filled." })
        .max(254, { message: "The email cannot have more than 254 character." }),
});

export default function ProcessForget(props: any) {
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
                <Form method="POST" action="/forget">
                    <p className="mb-5 text-mauve11 text-[15px] leading-normal">Reset your password</p>
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

                    <div className="flex justify-end mt-5">
                        <div>{active ? <Loading /> : ""}</div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-green4 text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default"
                        >
                            Submit
                        </button>

                      
                    </div>

                    <div>
                            <h1 className="flex justify-center text-red-500">{props.message}</h1>
                        </div>
                </Form>
            </Tabs.Content>
        </Tabs.Root>
    );
}
