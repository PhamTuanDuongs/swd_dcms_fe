import * as Tabs from "@radix-ui/react-tabs";
import { Form, Link, useNavigation } from "@remix-run/react";
import { z } from "zod";

import FormError from "~/components/formerror";
import Loading from "~/components/loadingspinner";

export const SignupSchema = z
    .object({
        email: z
            .string()
            .trim()
            .nonempty({ message: "The email cannot be empty." })
            .max(254, { message: "The email cannot have more than 254 character." })
            .email({ message: "Invalid email!" }),
        password: z.string().min(1, { message: "Password has to be filled." }).max(30, "Password must be below 30 character"),
        confirm: z.string().min(1, { message: "Confirm password has to be filled." }).max(30, "Password must be below 30 character"),
        name: z
            .string()
            .trim()
            .nonempty({ message: "The employee's name cannot be empty." })
            .max(62, { message: "The employee's name cannot have more than 62 character." })
            .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "The username cannot contain any special characters or numbers"),
        dob: z.coerce.date().max(new Date(), { message: "The date of birth is not greater than current date" }),
        address: z
            .string()
            .trim()
            .nonempty({ message: "The address cannot be empty." })
            .max(126, { message: "The address cannot have more than 126 character." }),
        nationalId: z
            .string()
            .trim()
            .nonempty({ message: "The national id cannot be empty." })
            .max(12, { message: "The national id cannot have more than 12 character." }),
        gender: z.boolean({ invalid_type_error: "This field has to be filled" }),
    })
    .refine((data) => data.password === data.confirm, {
        message: "Password and confirm password don't match",
        path: ["confirm"],
    });

export default function RegisterForm(props: any) {
    const transition = useNavigation();
    const active = transition.state !== "idle";
    return (
        <Tabs.Root className="flex m-20 justify-center flex flex-col w-[500px] shadow-[0_2px_10px] shadow-blackA4" defaultValue="tab2">
            <Tabs.List className="shrink-0 flex border-b border-mauve6" aria-label="Manage your account">
                <Tabs.Trigger
                    className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                    value="tab2"
                >
                    Sign up
                </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" value="tab2">
                <p className="mb-5 text-mauve11 text-[15px] leading-normal">
                    Change your password here. After saving, you'll be logged out.
                </p>
                <Form method="POST" action="/signup">
                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                        <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="currentPassword">
                            Email
                            <i className="text-red-600">*</i>
                        </label>
                        <input
                            name="email"
                            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                            id="Email"
                            type="text"
                        />
                        <FormError error={props.error?.message} field="email" />
                    </fieldset>
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

                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                        <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="confirmPassword">
                            Name
                            <i className="text-red-600">*</i>
                        </label>
                        <input
                            name="name"
                            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                            id="Name"
                            type="text"
                        />
                        <FormError error={props.error?.message} field="name" />
                    </fieldset>

                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                        <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="confirmPassword">
                            Date of birth
                            <i className="text-red-600">*</i>
                        </label>
                        <input
                            name="dob"
                            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                            id="Date of birth"
                            type="date"
                        />
                        <FormError error={props.error?.message} field="dob" />
                    </fieldset>

                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                        <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="confirmPassword">
                            Address
                            <i className="text-red-600">*</i>
                        </label>
                        <input
                            name="address"
                            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                            id="Address"
                            type="text"
                        />
                        <FormError error={props.error?.message} field="address" />
                    </fieldset>

                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                        <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="nationalId">
                            National Id
                            <i className="text-red-600">*</i>
                        </label>
                        <input
                            name="nationalId"
                            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                            id="nationalId"
                            type="text"
                        />
                        <FormError error={props.error?.message} field="nationalId" />
                    </fieldset>

                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                        <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="gender">
                            Gender
                            <i className="text-red-600">*</i>
                        </label>
                        <div className="flex items-center mb-4">
                            <input
                                id="default-radio-1"
                                type="radio"
                                value="1"
                                name="gender"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="default-radio-2"
                                type="radio"
                                value="0"
                                name="gender"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>
                        </div>
                        <FormError error={props.error?.message} field="gender" />
                    </fieldset>
                    <div className="flex justify-end mt-5">
                        <div>{active ? <Loading /> : ""}</div>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-green4 text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default"
                        >
                            Register
                        </button>
                    </div>
                    <div>
                        <h1 className="flex text-red-500 justify-center">{props?.data?.message}</h1>
                    </div>
                </Form>
                <div>
                    <span className="flex items-center justify-center">Already have an account?</span>
                    <Link
                        to="/login"
                        className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-pointer"
                    >
                        Login
                    </Link>
                </div>
            </Tabs.Content>
        </Tabs.Root>
    );
}
