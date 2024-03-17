import { Link } from "@remix-run/react";

import ApproveAppointmentComponent from "./ApproveAppointment";
import { CancelAppointment } from "./CancelAppointment";

import StatusBadge from "~/components/StatusBadgeComponent";

export default function AppointmentDetailComponent({ data, user }: any) {
    return (
        <div>
            <div className="flex space-x-8 mx-4 mt-2">
                <div>
                    <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                        AppointmentID: {data.id}
                    </span>
                </div>
                <div>
                    <StatusBadge status={data?.status} />
                </div>
            </div>
            <div className="grid grid-cols-5 mx-2"></div>
            <div className="grid grid-cols-5 ">
                <div className="col-span-2">
                    <div className="content flex mb-10">
                        <div className="rigth-content w-3/5 max-h-full w-full bg-indigo-200 border-2 rounded shadow-xl mx-4">
                            <div className="content m-8 h-1/2">
                                <h1 className=" title font-bold whitespace-nowrap dark:text-white mb-8">Patient</h1>
                                {data?.patient?.avatar ? (
                                    <img className="rounded-lg w-40 h-40" src={data?.patient?.avatar} alt="Avatar" />
                                ) : (
                                    <img
                                        className="rounded-lg w-40 h-40"
                                        src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                                        alt="Placeholder"
                                    />
                                )}
                                <div className="context grid  grid-cols-2 gap-4">
                                    <div className="gender mt-6">
                                        <dl>
                                            <dt>Name</dt>
                                            <dd className="font-bold"> {data?.patient?.name}</dd>
                                        </dl>
                                    </div>

                                    <div className="dob mt-6">
                                        <dl>
                                            <dt>Birthday</dt>
                                            <dd className="font-bold"> {data?.patient?.dob}</dd>
                                        </dl>
                                    </div>

                                    <div className="gender mt-6">
                                        <dl>
                                            <dt>Gender</dt>
                                            <dd className="font-bold"> {data?.patient?.gender ? "Male" : "Female"}</dd>
                                        </dl>
                                    </div>

                                    <div className="dob mt-6">
                                        <dl>
                                            <dt>Phone Number</dt>
                                            <dd className="font-bold"> {data?.patient?.phoneNo}</dd>
                                        </dl>
                                    </div>

                                    <div className="dob mt-6">
                                        <dl>
                                            <dt>Address</dt>
                                            <dd className="font-bold"> {data?.patient?.address}</dd>
                                        </dl>
                                    </div>

                                    <div className="col-span-2">
                                        <Link to={`../../patient/${data?.patient.id}/history`}>
                                            <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded block  w-full">
                                                View Appointment History
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-40 ml-9"></div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="content flex mb-10">
                        <div className="rigth-content w-3/5 max-h-full w-full bg-indigo-200 border-2 rounded shadow-xl mx-4">
                            <div className="content m-8 h-1/2">
                                <h1 className=" title font-bold whitespace-nowrap dark:text-white mb-8">Doctor</h1>
                                {data?.doctor.metadata?.avatar ? (
                                    <img className="rounded-lg w-40 h-40" src={data?.doctor.metadata?.avatar} alt="Avatar" />
                                ) : (
                                    <img
                                        className="rounded-lg w-40 h-40"
                                        src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                                        alt="Placeholder"
                                    />
                                )}

                                <div className="context grid grid-cols-2 gap-4">
                                    <div className="gender mt-6">
                                        <dl>
                                            <dt>Name</dt>
                                            <dd className="font-bold"> {data?.doctor.metadata.name}</dd>
                                        </dl>
                                    </div>

                                    <div className="dob mt-6">
                                        <dl>
                                            <dt>Birthday</dt>
                                            <dd className="font-bold"> {data?.doctor.metadata.dob}</dd>
                                        </dl>
                                    </div>

                                    <div className="gender mt-6">
                                        <dl>
                                            <dt>Gender</dt>
                                            <dd className="font-bold"> {data?.doctor.metadata.gender ? "Male" : "Female"}</dd>
                                        </dl>
                                    </div>

                                    <div className="gender mt-6">
                                        <dl>
                                            <dt></dt>
                                        </dl>
                                    </div>

                                    <div className="gender mt-6">
                                        <dl>
                                            <dt>Phone number</dt>
                                            <dd className="font-bold"> {data?.doctor.metadata.phoneNo}</dd>
                                        </dl>
                                    </div>
                                    <div className="col-span-2">
                                        <Link to={`../../medstaff/${data?.doctor.id}/view`}>
                                            <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded block w-full">
                                                View doctor details
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-40 ml-9"></div>
                        </div>
                    </div>
                </div>
                {user.role == "ADMIN" ? (
                    <div className="col-span-1">
                        <ApproveAppointmentComponent appointmentId={data.id} />
                        <CancelAppointment appointmentId={data.id} />
                        <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded block m-3 w-1/2">
                            Edit
                        </button>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}
