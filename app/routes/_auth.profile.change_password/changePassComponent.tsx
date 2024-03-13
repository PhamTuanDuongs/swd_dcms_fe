import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useNavigation, useSubmit } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "~/components/loadingspinner";

export const ChangePasswordSchema = z
    .object({
        password: z.string().trim().min(1, { message: "New password has to be filled." }).max(30, "Password must be below 30 character"),
        confirm: z
            .string()
            .trim()
            .min(1, { message: "Confirm new password has to be filled." })
            .max(30, "Password must be below 30 character"),
        current: z.string().trim().min(1, { message: "Password has to be filled." }).max(30, "Password must be below 30 character"),
    })
    .refine((data) => data.password === data.confirm, {
        message: "Password and confirm password don't match",
        path: ["confirm"],
    })
    .refine((data) => data.current !== data.password, {
        message: "New password can't be same with current password",
        path: ["password"],
    });

type UserInput = z.infer<typeof ChangePasswordSchema>;

export default function ChangePasswordProcess(props: any) {
    const submit = useSubmit();
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm<UserInput>({
        resolver: zodResolver(ChangePasswordSchema),
        mode: "onChange",
        defaultValues: {},
    });

    const transition = useNavigation();
    const active = transition.state !== "idle";

    return (
        <div>
            <div className="font-bold text-3xl m-8">Edit Profile</div>
            <div className="content flex">
                <div className="rigth-content w-4/5 max-h-full border-2 rounded shadow-xl mx-8">
                    <Form
                        onSubmit={handleSubmit(async (value) => {
                            const isValid = await trigger(undefined, { shouldFocus: true });
                            if (isValid) {
                                submit(value, { method: "POST" });
                            }
                        })}
                    >
                        <div className="content m-8 h-1/2">
                            <h1 className="title font-bold whitespace-nowrap dark:text-white mb-8">Change Password </h1>
                            <div className="context grid  grid-cols-2 gap-4">
                                <div className="dob mt-6">
                                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                                        <label className="text-violet11 w-[200px] text-left text-[15px]  font-bold" htmlFor="name">
                                            Current password
                                            <i className="text-red-600">*</i>
                                        </label>
                                        <input
                                            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                                            id="Password"
                                            type="password"
                                            {...register("current", { required: true })}
                                        />

                                        {errors?.current?.message && (
                                            <p className="text-red-600 mb-[15px] flex items-center">{errors.current.message}</p>
                                        )}
                                    </fieldset>
                                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                                        <label className="text-violet11 w-[200px] text-left text-[15px]  font-bold" htmlFor="name">
                                            New password
                                            <i className="text-red-600">*</i>
                                        </label>
                                        <input
                                            {...register("password", { required: true })}
                                            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                                            id="Password"
                                            type="password"
                                        />
                                        {errors?.password?.message && (
                                            <p className="text-red-600 mb-[15px] flex items-center">{errors.password.message}</p>
                                        )}
                                    </fieldset>

                                    <fieldset className="mb-[15px] w-full flex flex-col justify-start">
                                        <label className="text-violet11 w-[200px] text-left text-[15px]  font-bold" htmlFor="name">
                                            Confirm New password
                                            <i className="text-red-600">*</i>
                                        </label>
                                        <input
                                            {...register("confirm", { required: true })}
                                            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
                                            id="confirm"
                                            type="password"
                                        />
                                        {errors?.confirm?.message && (
                                            <p className="text-red-600 mb-[15px] flex items-center">{errors.confirm.message}</p>
                                        )}
                                    </fieldset>
                                    <div>
                                        <h1 className="flex text-red-500 justify-center">{props?.data?.message}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center ">
                                <div>{active ? <Loading /> : ""}</div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded font-medium text-[15px] px-[15px] leading-[35px] h-[35px] bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                                >
                                    Save password
                                </button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
