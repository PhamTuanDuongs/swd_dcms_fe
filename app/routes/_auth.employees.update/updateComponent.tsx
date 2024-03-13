import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { MedstaffMetadata, Role } from "~/types";

interface PropsType {
    medstaff: MedstaffMetadata;
    listRole: Role[];
    data: any;
}
const ZmedstaffMetadata = z.object({
    name: z
        .string()
        .nonempty({ message: "The employee's name cannot be empty." })
        .max(62, { message: "The employee's name cannot have more than 62 character." })
        .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "The username cannot contain any special characters or numbers"),
    dob: z.coerce.date().max(new Date(), { message: "The date of birth is not greater than current date" }),
    address: z
        .string()
        .nonempty({ message: "The address cannot be empty." })
        .max(126, { message: "The address cannot have more than 126 character." }),
    phoneNo: z
        .string()
        .nonempty({ message: "The phone number cannot be empty." })
        .max(10, { message: "The phone number cannot have more than 10 numbers." })
        .regex(/^\d+$/, { message: "Invalid phone number!" }),
    gender: z.string().nonempty({ message: "The gender cannot be empty." }),
    nationalId: z
        .string()
        .nonempty({ message: "The national ID cannot be empty." })
        .max(12, { message: "The national ID cannot have more than 12 characters." })
        .regex(/^\d+$/, { message: "Invalid national ID!" }),
    roleId: z.string().nonempty({ message: "The role ID cannot be empty" }),
    qualification: z
        .string()
        .endsWith(".", "The qualification must end with dot")
        .nonempty({ message: "The qualification cannot be empty." })
        .max(1000, { message: "The qualification cannot have more than 1000 character." }),
    experience: z
        .string()
        .endsWith(".", "The experience must end with dot")
        .nonempty({ message: "The experience cannot be empty." })
        .max(1000, { message: "The experience cannot have more than 1000 character." }),
    oldNationalId: z.string(),
});
export default function UpdateEmployee({ medstaff, listRole, data }: PropsType) {
    const [gender, setGender] = useState(medstaff.userDTO.metadata.gender);
    const [checkRole, setRole] = useState(medstaff.userDTO.role.id);
    const handleGenderChange = (e: any) => {
        const newGender = e.target.value === "true";
        setGender(newGender);
    };
    const handleRoleChange = (e: any) => {
        const newRole = e.target.value;
        setRole(newRole);
    };

    type UserInput = z.infer<typeof ZmedstaffMetadata>;

    const submit = useSubmit();
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm<UserInput>({
        resolver: zodResolver(ZmedstaffMetadata),
        mode: "onChange",
        defaultValues: {},
    });

    return (
        <div>
            <div className="font-bold text-3xl m-8 ml-32">Edit Employee</div>
            <div className="flex items-center justify-center mb-20 mt-10">
                <div className="rigth-content w-4/5 max-h-full border-2 rounded shadow-xl mx-8">
                    <Form
                        replace
                        method="post"
                        onSubmit={handleSubmit(async (value) => {
                            const isValid = await trigger(undefined, { shouldFocus: true });
                            if (isValid) submit(value, { method: "POST" });
                        })}
                    >
                        <div className="content m-8 h-1/2">
                            <div className="context grid  grid-cols-2 gap-4">
                                <div className="dob mt-6">
                                    <fieldset className="mb-[15px] w-96 gap-5">
                                        <label className="text-violet11 w-[130px] text-right text-[15px]  font-bold" htmlFor="name">
                                            Name
                                            <i className="text-red-600">*</i>
                                        </label>
                                        <br />
                                        <input
                                            className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                            id="name"
                                            defaultValue={medstaff.userDTO.metadata.name}
                                            {...register("name", { required: true })}
                                        />
                                    </fieldset>
                                    {errors?.name?.message && (
                                        <p className="text-red-600 mb-[15px]  gap-5 justify-center">{errors.name.message}</p>
                                    )}
                                </div>
                                <div className="dob mt-6">
                                    <fieldset className="mb-[15px] w-96 gap-5">
                                        <label className="text-violet11 w-[130px] text-right text-[15px]  font-bold" htmlFor="dob">
                                            Birthday
                                            <i className="text-red-600">*</i>
                                        </label>
                                        <br />
                                        <input
                                            className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                            id="dob"
                                            type="date"
                                            {...register("dob")}
                                            name="dob"
                                            defaultValue={medstaff.userDTO.metadata.dob}
                                        />
                                    </fieldset>
                                    {errors?.dob?.message && (
                                        <p className="text-red-600 mb-[15px]  gap-5 justify-center">{errors.dob.message}</p>
                                    )}
                                </div>
                                <div className="role mt-6">
                                    <fieldset className="mb-[15px] w-96 gap-5">
                                        <label className="text-violet11 w-[130px] text-right text-[15px] font-bold" htmlFor="nationalId">
                                            Identification Number
                                            <i className="text-red-600">*</i>
                                        </label>
                                        <br />
                                        <input
                                            className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                            id="nationalId"
                                            defaultValue={medstaff.userDTO.metadata.nationalId}
                                            {...register("nationalId")}
                                            name="nationalId"
                                        />
                                        <input
                                            type="hidden"
                                            id="oldNationalId"
                                            defaultValue={medstaff.userDTO.metadata.nationalId}
                                            {...register("oldNationalId")}
                                            name="oldNationalId"
                                        />
                                    </fieldset>
                                    {errors?.nationalId?.message && (
                                        <p className="text-red-600 mb-[15px]  gap-5 justify-center">{errors.nationalId.message}</p>
                                    )}
                                    {data?.status == 400 ? <p className="text-red-600">This identification number has existed</p> : <p></p>}
                                </div>
                                <div className="gender mt-6 mb-[15px] w-96 gap-5">
                                    <label className="text-violet11 w-[130px] text-right text-[15px] font-bold" htmlFor="nationalId">
                                        Gender
                                        <i className="text-red-600">*</i>
                                    </label>
                                    <br />
                                    <ul className="items-center w-96 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center pl-3">
                                                <input
                                                    id="horizontal-list-radio-license"
                                                    type="radio"
                                                    {...register("gender")}
                                                    value="false"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                    checked={gender === false}
                                                    onChange={handleGenderChange}
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
                                                    checked={gender === true}
                                                    onChange={handleGenderChange}
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
                                    </ul>
                                </div>
                                <div className="phone mt-6">
                                    <fieldset className="mb-[15px] w-96 gap-5">
                                        <label className="text-violet11 w-[130px] text-right text-[15px] font-bold" htmlFor="phone">
                                            Phone Number
                                            <i className="text-red-600">*</i>
                                        </label>
                                        <br />
                                        <input
                                            className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                            id="phone"
                                            defaultValue={medstaff.userDTO.metadata.phoneNo}
                                            {...register("phoneNo")}
                                        />
                                    </fieldset>
                                    {errors?.phoneNo?.message && (
                                        <h1 className="text-red-600 mb-[15px]  gap-5 justify-center">{errors.phoneNo.message}</h1>
                                    )}
                                </div>
                                <div className="address mt-6">
                                    <fieldset className="mb-[15px] w-96 gap-5">
                                        <label className="text-violet11 w-[130px] text-right text-[15px] font-bold" htmlFor="address">
                                            Address
                                            <i className="text-red-600">*</i>
                                        </label>
                                        <br />
                                        <input
                                            className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                                            id="address"
                                            defaultValue={medstaff.userDTO.metadata.address}
                                            {...register("address")}
                                            name="address"
                                        />
                                    </fieldset>
                                    {errors?.address?.message && (
                                        <p className="text-red-600 mb-[15px]  gap-5 justify-center">{errors.address.message}</p>
                                    )}
                                </div>
                                <div className="address mt-6">
                                    <label className="text-violet11 w-[130px] text-right text-[15px] font-bold" htmlFor="address">
                                        Position
                                        <i className="text-red-600">*</i>
                                    </label>
                                    <br />
                                    <select
                                        id="role"
                                        {...register("roleId")}
                                        className="select border-separate border-x border-y bg-gray-200 w-40"
                                    >
                                        {listRole.map((role) => (
                                            <option
                                                key={role.id}
                                                selected={checkRole == role.id}
                                                value={role.id}
                                                onChange={handleRoleChange}
                                            >
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors?.roleId?.message && (
                                        <p className="text-red-600 mb-[15px]  gap-5 justify-center">{errors.roleId.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="text-violet11 w-[130px] text-right text-[15px] font-bold" htmlFor="qualification">
                                    Qualification
                                    <i className="text-red-600">*</i>
                                </label>
                                <br />
                                <textarea
                                    defaultValue={medstaff.qualification}
                                    {...register("qualification")}
                                    id="qualification"
                                    cols={113}
                                    rows={7}
                                ></textarea>
                                <br />
                                {errors?.qualification?.message && (
                                    <p className="text-red-600 mb-[15px]  gap-5 justify-center">{errors.qualification.message}</p>
                                )}
                            </div>
                            <div className="mt-6">
                                <label className="text-violet11 w-[130px] text-right text-[15px] font-bold" htmlFor="experience">
                                    Experience
                                    <i className="text-red-600">*</i>
                                </label>
                                <br />
                                <textarea
                                    defaultValue={medstaff.experience}
                                    {...register("experience")}
                                    id="experience"
                                    cols={113}
                                    rows={7}
                                ></textarea>
                                <br />
                                {errors?.experience?.message && (
                                    <p className="text-red-600 mb-[15px]  gap-5 justify-center">{errors.experience.message}</p>
                                )}
                            </div>
                            <div className="mt-6 w-96 justify-center">
                                <button
                                    type="submit"
                                    className="inline-w-96 justify-center rounded font-medium text-[15px] px-[15px] leading-[35px] h-[35px] bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
