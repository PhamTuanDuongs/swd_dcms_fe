import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Tabs from "@radix-ui/react-tabs";
import type { ActionFunctionArgs } from "@remix-run/cloudflare"; // or cloudflare/deno
import { json } from "@remix-run/cloudflare"; // or cloudflare/deno
import { Form, useActionData, useNavigate, useSubmit } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { createEmployee, getUserByEmail, getUserByNationalID } from "../../services/medstaff";

import ToastFail from "~/components/toastfail";
import ToastDemo from "~/components/toatsdemo";

const ZEmployeeInput = z.object({
    name: z
        .string()
        .trim()
        .nonempty({ message: "The employee's name cannot be empty." })
        .max(62, { message: "The employee's name cannot have more than 62 character." })
        .regex(/^[a-zA-Z ]+$/, "The username must contain only letters"),
    address: z
        .string()
        .trim()
        .nonempty({ message: "The address cannot be empty." })
        .max(126, { message: "The address cannot have more than 126 character." }),
    phoneNo: z
        .string()
        .trim()
        .nonempty({ message: "The phone number cannot be empty." })
        .max(30, { message: "The phone number cannot have more than 30 character." })
        .regex(/^\d+$/, { message: "Invalid phone number!" }),
    dob: z.string().nonempty({ message: "The date of birth cannot be empty." }),
    gender: z.string({ description: "The gender cannot be empty." }).nonempty({ message: "The gender cannot be empty." }),
    nationalId: z
        .string()
        .trim()
        .nonempty({ message: "The national ID cannot be empty." })
        .max(30, { message: "The national ID cannot have more than 30 characters." })
        .regex(/^\d+$/, { message: "Invalid national ID!" }),
    email: z
        .string()
        .trim()
        .nonempty({ message: "The email cannot be empty." })
        .max(254, { message: "The email cannot have more than 254 character." })
        .email({ message: "Invalid email!" }),
    role: z.string().nonempty({ message: "The role cannot be empty." }),
    qualification: z
        .string()
        .trim()
        .nonempty({ message: "The qualification cannot be empty." })
        .max(510, { message: "The qualification cannot have more than 510 characters." }),
    experience: z
        .string()
        .trim()
        .nonempty({ message: "The experience cannot be empty." })
        .max(510, { message: "The experience cannot have more than 510 characters." }),
});
type EmployeeInput = z.infer<typeof ZEmployeeInput>;

export async function action({ request, context }: ActionFunctionArgs) {
    const data = await request.formData();

    const email = data.get("email");
    const name = data.get("name");
    const nationalID = data.get("nationalId");
    const phoneNo = data.get("phoneNo");
    const dob = data.get("dob");
    const address = data.get("address");
    const gender = data.get("gender");
    const qualification = data.get("qualification");
    const experience = data.get("experience");
    const role = data.get("role");
    const ZEmployeeInput = zfd.formData({
        name: zfd.text(
            z
                .string()
                .nonempty()
                .max(62)
                .regex(/^[a-zA-Z ]+$/),
        ),
        address: zfd.text(z.string().nonempty().max(126)),
        dob: zfd.text(z.coerce.date().max(new Date())),

        phoneNo: zfd.text(z.string().nonempty().max(30).regex(/^\d+$/)),
        gender: zfd.text(z.string().nonempty()),
        nationalId: zfd.text(z.string().nonempty().max(30).regex(/^\d+$/)),

        email: zfd.text(z.string().nonempty().max(254).email()),
        role: zfd.text(z.string().nonempty()),

        qualification: zfd.text(z.string().nonempty().max(510)),
        experience: zfd.text(z.string().nonempty().max(510)),
    });

    const user = {
        userDTO: {
            email: email,
            metadata: {
                name: name,
                dob: dob,
                address: address,
                phoneNo: phoneNo,
                gender: gender == "1",
                nationalId: nationalID,
            },
            role: {
                id: role == "Nurse" ? 2 : role == "Doctor" ? 3 : 4,
                roleName: role,
            },
        },

        qualification: qualification,
        experience: experience,
    };
    try {
        ZEmployeeInput.parse(data);

        const emailExists = await getUserByEmail(context, email);
        if (emailExists) {
            return json({ status: "401", message: "This email has exited!" });
        }
        const nationalIdExists = await getUserByNationalID(context, nationalID);
        if (nationalIdExists) {
            return json({ status: "400", message: "This nationalID has exited!" });
        }
        await createEmployee(user, context);
        return json({ status: "200", message: "Added succesfully" });
    } catch (error: any) {
        return json({ status: "500", message: "Server error" });
    }
}

export default function InputData(props: any) {
    const data: any = useActionData<typeof action>();
    const navigate = useNavigate();
    useEffect(() => {
        if (data?.status == "200") {
            var navigateOnSuccess = setTimeout(() => {
                navigate("/employees");
            }, 2000);
        }
        if (data?.status == "500") {
            navigateOnSuccess = setTimeout(() => {
                navigate("/employees/add");
            }, 2000);
        }
        return () => {
            clearTimeout(navigateOnSuccess);
        };
    }, [data]);

    const submit = useSubmit();

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm<EmployeeInput>({
        mode: "onChange",
        resolver: zodResolver(ZEmployeeInput),

        defaultValues: {},
    });

    return (
        <>
            <div className="p-8 justify-center">
                <h1 className="text-center text-3xl font-semibold text-gray-900 dark:text-white">Add Employee</h1>
                <div className="mt-4"></div>
                <div className="justify-center flex">
                    <Tabs.Root
                        className="Tabroot justify-center flex flex-col w-[600px] shadow-[0_2px_10px] shadow-blackA4 align-middle"
                        defaultValue="tab2"
                    >
                        <Tabs.Content
                            className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                            value="tab2"
                        >
                            <Form
                                method="post"
                                onSubmit={handleSubmit(async (value) => {
                                    const isValid = await trigger(undefined, { shouldFocus: true });
                                    if (isValid) submit(value, { method: "POST" });
                                })}
                            >
                                <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                                    <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="name">
                                        Fullname<label className="text-red-600">*</label>
                                    </label>
                                    <input
                                        className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                                        id="name"
                                        type="text"
                                        {...register("name", { required: true })}
                                    />

                                    {errors?.name?.message && <p className="text-red-600">{errors.name.message}</p>}
                                </fieldset>
                                <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                                    <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="address">
                                        Address<label className="text-red-600">*</label>
                                    </label>
                                    <input
                                        className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                                        id="address"
                                        type="text"
                                        {...register("address")}
                                    />
                                    {errors?.address?.message && <p className="text-red-600">{errors.address.message}</p>}
                                </fieldset>

                                <div className="flex items-center">
                                    <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="gender">
                                        Gender<label className="text-red-600">*</label>
                                    </label>
                                    <input
                                        id="default-radio-2"
                                        type="radio"
                                        {...register("gender")}
                                        checked
                                        value="0"
                                        name="gender"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>
                                    <input
                                        id="default-radio-2"
                                        type="radio"
                                        {...register("gender")}
                                        value="1"
                                        name="gender"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
                                    {errors?.gender?.message && <p className="text-red-600">{errors.gender.message}</p>}
                                </div>
                                <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                                    <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="nationalId">
                                        Identification ID<label className="text-red-600">*</label>
                                    </label>
                                    <input
                                        className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                                        id="nationId"
                                        type="text"
                                        {...register("nationalId")}
                                    />
                                    {data?.status == "400" ? (
                                        <p className="text-red-600">This identification number has existed</p>
                                    ) : (
                                        <p></p>
                                    )}
                                    {errors?.nationalId?.message && <p className="text-red-600">{errors.nationalId.message}</p>}
                                </fieldset>

                                <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                                    <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="phoneNo">
                                        Phone Number<label className="text-red-600">*</label>
                                    </label>
                                    <input
                                        className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                                        id="phoneNo"
                                        type="text"
                                        {...register("phoneNo")}
                                    />
                                    {errors?.phoneNo?.message && <p className="text-red-600">{errors.phoneNo.message}</p>}
                                </fieldset>

                                <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                                    <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="dob">
                                        Date of birth<label className="text-red-600">*</label>
                                    </label>
                                    <input
                                        className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                                        id="dob"
                                        type="date"
                                        {...register("dob")}
                                    />
                                    {errors?.dob?.message && <p className="text-red-600">{errors.dob.message}</p>}
                                </fieldset>

                                <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                                    <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="email">
                                        Email<label className="text-red-600">*</label>
                                    </label>
                                    <input
                                        className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                                        id="email"
                                        type="text"
                                        {...register("email")}
                                    />
                                    {data?.status == "401" ? <p className="text-red-600">This email has existed</p> : <p></p>}
                                    {errors?.email?.message && <p className="text-red-600">{errors.email.message}</p>}
                                </fieldset>
                                <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                                    <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="qualification">
                                        Qualification<label className="text-red-600">*</label>
                                    </label>
                                    <input
                                        className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[350px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                                        id="qualification"
                                        type="text"
                                        {...register("qualification")}
                                    />
                                    {errors?.qualification?.message && <p className="text-red-600">{errors.qualification.message}</p>}
                                </fieldset>
                                <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                                    <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="experience">
                                        Experience<label className="text-red-600">*</label>
                                    </label>
                                    <input
                                        className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[350px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                                        id="experience"
                                        type="text"
                                        {...register("experience")}
                                    />
                                    {errors?.experience?.message && <p className="text-red-600">{errors.experience.message}</p>}
                                </fieldset>
                                <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                                    <label className="text-[13px] leading-none mb-2.5 text-violet12 block" htmlFor="role">
                                        Role<label className="text-red-600">*</label>
                                    </label>
                                    <select
                                        id="role"
                                        {...register("role")}
                                        className="select border-separate border-x border-y bg-gray-200 w-32"
                                    >
                                        <option value={"Nurse"}>Nurse</option>
                                        <option value={"Doctor"}>Doctor</option>
                                        <option value={"Admin"}>Admin</option>
                                    </select>
                                    {errors?.role?.message && <p className="text-red-600">{errors.role.message}</p>}
                                </fieldset>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-green4 text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default border-separate bg-violet-300 "
                                >
                                    Save
                                </button>
                                {data?.status == "200" ? <ToastDemo message={"Added successfully!"} /> : ""}
                                {data?.status == "500" ? <ToastFail message={"Server Error!"} /> : ""}
                            </Form>
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>
        </>
    );
}
