import type { ActionArgs } from "@remix-run/cloudflare"; // or cloudflare/deno
import { json } from "@remix-run/cloudflare"; // or cloudflare/deno
import { Form, useActionData, useNavigate, useSubmit } from "@remix-run/react";
import { getUserByNationalID } from "../../services/medstaff";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zfd } from "zod-form-data";
import { useEffect } from "react";
import ToastDemo from "~/components/toatsdemo";
import ToastFail from "~/components/toastfail";
import { RegisterUser } from "~/services/user";

const ZPatientInput = z.object({
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
});
type PatientInput = z.infer<typeof ZPatientInput>;

export async function action({ request, context }: ActionArgs) {
    const data = await request.formData();

    const name = data.get("name");
    const nationalID = data.get("nationalId");
    const phoneNo = data.get("phoneNo");
    const dob = data.get("dob");
    const address = data.get("address");
    const gender = data.get("gender");

    const ZPatientInput = zfd.formData({
        name: zfd.text(
            z
                .string()
                .nonempty()
                .max(62)
                .regex(/^[a-zA-Z ]+$/)
        ),
        address: zfd.text(z.string().nonempty().max(126)),
        dob: zfd.text(z.coerce.date().max(new Date())),

        phoneNo: zfd.text(z.string().nonempty().max(30).regex(/^\d+$/)),
        gender: zfd.text(z.string().nonempty()),
        nationalId: zfd.text(z.string().nonempty().max(30).regex(/^\d+$/)),
    });

    const user = {
        metadata: {
            name: name,
            dob: dob,
            address: address,
            phoneNo: phoneNo,
            gender: gender == "1",
            nationalId: nationalID,
        },
    };
    try {
        ZPatientInput.parse(data);

        const nationalIdExists = await getUserByNationalID(context, nationalID);
        if (nationalIdExists) {
            return json({ status: "400", message: "This identification number has exited!" });
        }
        await RegisterUser(user, context);
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
                navigate("/patient");
            }, 2000);
        }
        if (data?.status == "500") {
            navigateOnSuccess = setTimeout(() => {
                navigate("/patient/add");
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
    } = useForm<PatientInput>({
        mode: "onChange",
        resolver: zodResolver(ZPatientInput),

        defaultValues: {},
    });

    return (
        <>
            <div className="rigth-content w-4/5 max-h-full border-2 rounded shadow-xl mx-8">
                <Form
                    method="post"
                    onSubmit={handleSubmit(async (value) => {
                        const isValid = await trigger(undefined, { shouldFocus: true });
                        if (isValid) submit(value, { method: "POST" });
                    })}
                >
                    <div className="content m-8 h-1/2">
                        <div className="context grid  grid-cols-2 gap-4">
                            <div className="dob mt-6">
                                <fieldset className="  gap-5">
                                    <label className="text-violet11 w-[130px]  text-right text-[15px]  font-bold" htmlFor="name">
                                        Name
                                        <i className="text-red-600">*</i>
                                    </label>
                                    <input
                                        className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-80 flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                        id="name"
                                        {...register("name", { required: true })}
                                    />
                                </fieldset>
                                {errors?.name?.message && <p className="text-red-600   gap-5 justify-center">{errors.name.message}</p>}
                            </div>
                            <div className="dob mt-6">
                                <fieldset className="  gap-5">
                                    <label className="text-violet11   text-right text-[15px]  font-bold" htmlFor="dob">
                                        Birthday
                                        <i className="text-red-600">*</i>
                                    </label>

                                    <input
                                        className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-80 flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                        id="dob"
                                        type="date"
                                        {...register("dob")}
                                        name="dob"
                                    />
                                </fieldset>
                                {errors?.dob?.message && <p className="text-red-600   gap-5 justify-center">{errors.dob.message}</p>}
                            </div>
                            <div className="role mt-6">
                                <fieldset className="  gap-5">
                                    <label className="text-violet11   text-right text-[15px] font-bold" htmlFor="nationalId">
                                        Identification Number
                                        <i className="text-red-600">*</i>
                                    </label>

                                    <input
                                        className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-80 flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                        id="nationalId"
                                        {...register("nationalId")}
                                        name="nationalId"
                                    />
                                </fieldset>
                                {errors?.nationalId?.message && (
                                    <p className="text-red-600   gap-5 justify-center">{errors.nationalId.message}</p>
                                )}
                                {data?.status == "400" ? <p className="text-red-600">This identification number has existed</p> : <p></p>}
                            </div>
                            <div className="gender mt-6   gap-5">
                                <label className="text-violet11   text-right text-[15px] font-bold" htmlFor="nationalId">
                                    Gender
                                    <i className="text-red-600">*</i>
                                </label>

                                <ul className="items-center w-80 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center pl-3">
                                            <input
                                                id="horizontal-list-radio-license"
                                                type="radio"
                                                {...register("gender")}
                                                value="false"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                defaultChecked={true}
                                                name="gender"
                                            />
                                            <label
                                                htmlFor="horizontal-list-radio-license"
                                                className="w-full py-1 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Female
                                            </label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center pl-3">
                                            <input
                                                id="horizontal-list-radio-id"
                                                type="radio"
                                                value="true"
                                                {...register("gender")}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                name="gender"
                                            />

                                            <label
                                                htmlFor="horizontal-list-radio-id"
                                                className="w-full py-1 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Male
                                            </label>
                                        </div>
                                    </li>
                                    {errors?.gender?.message && (
                                        <p className="text-red-600   gap-5 justify-center">{errors.gender.message}</p>
                                    )}
                                </ul>
                            </div>

                            <div className="phone mt-6">
                                <fieldset className="  gap-5">
                                    <label className="text-violet11   text-right text-[15px] font-bold" htmlFor="phone">
                                        Phone Number
                                        <i className="text-red-600">*</i>
                                    </label>

                                    <input
                                        className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-80 flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                        id="phone"
                                        {...register("phoneNo")}
                                        name="phoneNo"
                                    />
                                </fieldset>
                                {errors?.phoneNo?.message && (
                                    <h1 className="text-red-600   gap-5 justify-center">{errors.phoneNo.message}</h1>
                                )}
                            </div>
                            <div className="address mt-6">
                                <fieldset className="  gap-5">
                                    <label className="text-violet11   text-right text-[15px] font-bold" htmlFor="address">
                                        Address
                                        <i className="text-red-600">*</i>
                                    </label>

                                    <input
                                        className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-80 flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                        id="address"
                                        {...register("address")}
                                        name="address"
                                    />
                                </fieldset>
                                {errors?.address?.message && (
                                    <p className="text-red-600   gap-5 justify-center">{errors.address.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded font-medium text-[15px] px-[15px] leading-[35px] h-[35px] bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                            >
                                ADD
                            </button>
                        </div>
                    </div>
                    {data?.status == "200" ? <ToastDemo message={"Added successfully!"} /> : ""}
                    {data?.status == "500" ? <ToastFail message={"Server Error!"} /> : ""}
                </Form>
            </div>
        </>
    );
}
