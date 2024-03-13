import { type LoaderArgs, type V2_MetaFunction, json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getEmployeesById } from "~/services/medstaff";
import type { MedstaffMetadata } from "~/types";
import { requireAdmin } from "~/utils/function/UserUtils";

export async function loader({ context, request }: LoaderArgs) {
    await requireAdmin(request);
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    try {
        const medstaff = await getEmployeesById(id, context);
        if (medstaff == undefined) throw new Response("Metadata not found", { status: 403, statusText: "Internal server error" });
        return json(medstaff);
    } catch (error) {
        throw new Response("Internal server error", { status: 500, statusText: "Internal server error" });
    }
}

export const meta: V2_MetaFunction = () => {
    return [{ title: "View Employee Details" }];
};

export default function View() {
    const data = useLoaderData<typeof loader>() as MedstaffMetadata;

    const arrQualification = data.qualification.split(".");
    const arrExperience = data.experience.split(".");
    return (
        <div>
            <div className="font-bold text-3xl m-8">View Employee Details</div>

            <div className="content flex mb-10">
                <div className="content-center w-96 h-120 ms-8 border-2 rounded shadow-xl">
                    <div className="items-center m-8">
                        <div className="mt-6">
                            <dl>
                                <dt>Name</dt>
                                <dd className="font-bold"> {data.userDTO.metadata.name}</dd>
                            </dl>
                        </div>
                        <div className="mt-6">
                            <dl>
                                <dt>Address</dt>
                                <dd className="font-bold"> {data.userDTO.metadata.address}</dd>
                            </dl>
                        </div>
                        <div className="mt-6">
                            <dl>
                                <dt>Identification Number</dt>
                                <dd className="font-bold"> {data.userDTO.metadata.nationalId}</dd>
                            </dl>
                        </div>
                        <div className="mt-6">
                            <dl>
                                <dt>Email address</dt>
                                <dd className="font-bold"> {data.userDTO.email}</dd>
                            </dl>
                        </div>
                        <div className="mt-6">
                            <dl>
                                <dt>Phone number</dt>
                                <dd className="font-bold">{data.userDTO.metadata.phoneNo}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="rigth-content w-4/5 max-h-full border-2 rounded shadow-xl mx-8">
                    <div className="content m-8 h-1/2">
                        <h1 className=" title font-bold whitespace-nowrap dark:text-white ms-7 mb-8">General Information</h1>
                        <div className="context grid ms-8 grid-cols-2 gap-4">
                            <div className="dob mt-6">
                                <dl>
                                    <dt>Birthday</dt>
                                    <dd className="font-bold">{data.userDTO.metadata.dob}</dd>
                                </dl>
                            </div>
                            <div className="role mt-6">
                                <dl>
                                    <dt>Role</dt>
                                    <dd className="font-bold">{data.userDTO.role.name}</dd>
                                </dl>
                            </div>
                            <div className="gender mt-6">
                                <dl>
                                    <dt>Gender</dt>
                                    <dd className="font-bold">{data.userDTO.metadata.gender == true ? "Male" : "Female"}</dd>
                                </dl>
                            </div>
                            <div className="national mt-6">
                                <dl>
                                    <dt>Join Date</dt>
                                    <dd className="font-bold">{data.userDTO.createdAt}</dd>
                                </dl>
                            </div>
                        </div>
                        <div className="content m-8 mt-8">
                            <span>Qualification: </span>
                            <ul className="list-outside list-disc">
                                {arrQualification
                                    .filter((e) => e !== null && e !== "")
                                    .map((e) => (
                                        <li className="font-semibold" key={e}>
                                            {e}.
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div className="content m-8 mt-8">
                            <span>Experience: </span>
                            <ul className="list-outside list-disc">
                                {arrExperience
                                    .filter((e) => e !== null && e !== "")
                                    .map((e) => (
                                        <li className="font-semibold" key={e}>
                                            {e}.
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <button className=" ml-4 inline-flex items-center justify-center rounded font-medium text-[15px] px-[15px] leading-[35px] h-[35px] bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black">
                            <Link to={"/employees/update?id=" + data.userDTO.id}>Edit Employee</Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
