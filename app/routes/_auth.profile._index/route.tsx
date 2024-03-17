import { MetaFunction } from "@remix-run/cloudflare";
import { Link, useRouteLoaderData } from "@remix-run/react";

import type { User } from "~/types";

export const meta: MetaFunction = () => {
    return [{ title: "Profile" }];
};

export default function ViewProfile() {
    const user = useRouteLoaderData("routes/_auth.profile") as User;
    return (
        <div>
            <div className="font-bold text-3xl m-8">Profile</div>

            <div className="content flex mb-10">
                <div className="content-center w-96 h-120 ms-8 bg-indigo-200		  border-2 rounded shadow-xl">
                    <div className="items-center m-8">
                        <div className="flex justify-center">
                            {user?.metadata?.avatar ? (
                                <img className="rounded-lg w-40 h-40" src={user?.metadata?.avatar} alt="Avatar" />
                            ) : (
                                <img
                                    className="rounded-lg w-40 h-40"
                                    src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                                    alt="Placeholder"
                                />
                            )}
                        </div>
                        <div className="mt-6">
                            <dl>
                                <dt>Name</dt>
                                <dd className="font-bold"> {user?.metadata.name}</dd>
                            </dl>
                        </div>
                        <div className="mt-6">
                            <dl>
                                <dt>Address</dt>
                                <dd className="font-bold"> {user?.metadata.address}</dd>
                            </dl>
                        </div>
                        <div className="mt-6">
                            <dl>
                                <dt>Email address</dt>
                                <dd className="font-bold"> {user?.email}</dd>
                            </dl>
                        </div>
                        <div className="mt-6">
                            <dl>
                                <dt>Phone number</dt>
                                <dd className="font-bold">{user?.metadata.phoneNo}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="rigth-content w-3/5 max-h-full  bg-indigo-200	 border-2 rounded shadow-xl mx-8">
                    <div className="content m-8 h-1/2">
                        <h1 className=" title font-bold whitespace-nowrap dark:text-white mb-8">General Information</h1>
                        <div className="context grid  grid-cols-2 gap-4">
                            <div className="dob mt-6">
                                <dl>
                                    <dt>Birthday</dt>
                                    <dd className="font-bold">{user?.metadata.dob}</dd>
                                </dl>
                            </div>
                            <div className="join mt-6">
                                <dl>
                                    <dt>Join Date</dt>
                                    <dd className="font-bold">{user.createdAt}</dd>
                                </dl>
                            </div>
                            <div className="role mt-6">
                                <dl>
                                    <dt>Role</dt>
                                    <dd className="font-bold">{user?.role.name}</dd>
                                </dl>
                            </div>
                            <div className="gender mt-6">
                                <dl>
                                    <dt>Gender</dt>
                                    <dd className="font-bold">{user?.metadata.gender == true ? "Male" : "Female"}</dd>
                                </dl>
                            </div>
                            <div className="national mt-6">
                                <dl>
                                    <dt>Identification Number</dt>
                                    <dd className="font-bold">{user?.metadata.nationalId}</dd>
                                </dl>
                            </div>
                            {user?.metadata.nationalId === "Doctor" && (
                                <div className="national mt-6">
                                    <dl>
                                        <dt>Education</dt>
                                        <dd className="font-bold">{user?.metadata.nationalId}</dd>
                                    </dl>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-40 ml-9">
                        <Link
                            className="inline-flex items-center justify-center rounded font-medium text-[15px] px-[15px] leading-[35px] h-[35px] bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                            to={"/profile/update"}
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
