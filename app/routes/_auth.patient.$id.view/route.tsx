import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData, useRouteLoaderData } from "@remix-run/react";

import { getPatientById } from "~/services/patient";
import { Metadata } from "~/types";
import { requireAdmin } from "~/utils/function/UserUtils";

export const meta: MetaFunction = () => {
    return [{ title: "View Patient Details" }];
};

export async function loader({ context, request, params }: LoaderFunctionArgs) {
    await requireAdmin(request);
    const id = params?.id;
    try {
        const patient = await getPatientById(id, context);
        if (patient == undefined) throw new Response("Patient not found", { status: 403, statusText: "Internal server error" });
        return json({
            patient,
        });
    } catch (error) {
        throw new Response("Internal server error", { status: 500, statusText: "Internal server error" });
    }
}

export default function ViewPatient() {
    const data = useLoaderData<typeof loader>();
    const patient = data.patient as Metadata;
    return (
        <div>
            <h1 className="font-bold text-3xl m-8 ml-60">View Patient Details</h1>
            <div className="flex items-center justify-center mb-20">
                <div className="rigth-content w-3/5  bg-indigo-200	 border-2 rounded shadow-xl">
                    <div className="content m-8">
                        <h1 className=" title font-bold whitespace-nowrap dark:text-white mb-8">General Information</h1>
                        <div className="context grid  grid-cols-2 gap-4">
                            <div className="dob mt-6">
                                <dl>
                                    <dt>Name</dt>
                                    <dd className="font-bold">{patient.name}</dd>
                                </dl>
                            </div>
                            <div className="join mt-6">
                                <dl>
                                    <dt>Birthday</dt>
                                    <dd className="font-bold">{patient.dob}</dd>
                                </dl>
                            </div>
                            <div className="role mt-6">
                                <dl>
                                    <dt>Phone Number</dt>
                                    <dd className="font-bold">{patient.phoneNo}</dd>
                                </dl>
                            </div>
                            <div className="gender mt-6">
                                <dl>
                                    <dt>Gender</dt>
                                    <dd className="font-bold">{patient.gender == true ? "Male" : "Female"}</dd>
                                </dl>
                            </div>
                            <div className="national mt-6">
                                <dl>
                                    <dt>Identification Number</dt>
                                    <dd className="font-bold">{patient.nationalId}</dd>
                                </dl>
                            </div>
                            <div className="address mt-6">
                                <dl>
                                    <dt>Address</dt>
                                    <dd className="font-bold">{patient.address}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 mb-8 ml-9">
                        <Link
                            className="inline-flex items-center justify-center rounded font-medium text-[15px] px-[15px] leading-[35px] h-[35px] bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                            to={"/patient/" + patient.id + "/update"}
                        >
                            Edit Patient
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
