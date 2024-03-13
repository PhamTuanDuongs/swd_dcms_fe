import { Form, Link, useSubmit } from "@remix-run/react";
import { useState } from "react";
import StatusBadge from "~/components/StatusBadgeComponent";

export default function HistoryTable({ data, patientId }: any) {
    const [tab, setTab] = useState(1);
    const activeClass = "py-2 px-8 bg-indigo-100 text-indigo-700";
    const nonActiveClass = "py-2 px-8 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 ";
    const handleOnclick = (id: number) => {
        setTab(id);
    };
    const { currentPage, totalPage, sortBy ,query} = data;
    const appointments = [...data?.appointments];
    const submit = useSubmit();
    return (
        <div>
            <div className="px-4 md:px-10 py-4 md:py-7">
                <div className="flex items-center justify-between">
                    <p
                        tabIndex={0}
                        className="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800"
                    >
                        Appointment of {appointments?.[0]?.patient?.name}
                    </p>
                    <div className="py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded">
                        <p>Sort By:</p>
                        <Form
                            onChange={(e) => {
                                submit(e.currentTarget);
                            }}
                            action={`../../patient/${patientId}/history?page=${currentPage + 1}`}
                            method="GET"
                        >
                            <input type="hidden" name="page" value={currentPage} />
                            <select
                                aria-label="select"
                                name="sortBy"
                                className="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
                            >
                                <option className="text-sm text-indigo-800">latest</option>
                                <option className="text-sm text-indigo-800">oldest</option>
                            </select>
                        </Form>
                    </div>
                </div>
            </div>
            <section className="container mx-auto p-6 font-mono">
                <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                    <div className="w-full overflow-x-auto">
                        <div className="flex items-center bg-white">
                            <Link
                                to={`../../patient/${patientId}/history?page=1&sortBy=${sortBy}&query=all`}
                                onClick={(e) => {
                                    handleOnclick(1);
                                }}
                                id="1"
                                className="focus:outline-none focus:bg-indigo-50 focus:ring-indigo-800"
                            >
                                <div className={tab == 1 ? activeClass : nonActiveClass}>
                                    <p>All</p>
                                </div>
                            </Link>
                            <Link
                                to={`../../patient/${patientId}/history?page=1&sortBy=${sortBy}&query=completed`}
                                onClick={(e) => {
                                    handleOnclick(2);
                                }}
                                id="2"
                                className="focus:outline-none   focus:bg-indigo-50 focus:ring-indigo-800 "
                            >
                                <div className={tab == 2 ? activeClass : nonActiveClass}>
                                    <p>Completed</p>
                                </div>
                            </Link>
                            <Link
                                to={`../../patient/${patientId}/history?page=1&sortBy=${sortBy}&query=pending`}
                                onClick={(e) => {
                                    handleOnclick(3);
                                }}
                                id="3"
                                className="focus:outline-none focus:bg-indigo-50 focus:ring-indigo-800"
                            >
                                <div className={tab == 3 ? activeClass : nonActiveClass}>
                                    <p>Pending</p>
                                </div>
                            </Link>
                        </div>

                        <table className="w-full">
                            <thead>
                                <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Room</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">View</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {appointments.map((appointment, index) => {
                                    return (
                                        <tr key={index} className="text-gray-700">
                                            <td className="px-4 py-3 border">
                                                <div className="flex items-center text-sm">
                                                    <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                                                        <img
                                                            className="object-cover w-full h-full rounded-full"
                                                            src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                                                            alt=""
                                                            loading="lazy"
                                                        />
                                                        <div
                                                            className="absolute inset-0 rounded-full shadow-inner"
                                                            aria-hidden="true"
                                                        ></div>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-black">{appointment?.doctor.metadata.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-ms font-semibold border">{appointment?.room}</td>
                                            <td className="px-4 py-3 text-xs border">
                                                <StatusBadge status={appointment?.status} />
                                            </td>
                                            <td className="px-4 py-3 text-sm border">{appointment?.date}</td>
                                            <td className="px-4 py-3 text-sm border">
                                                <Link to={`../../appointment/${appointment?.id}`}>View</Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <div className="max-w-2xl mx-auto space flex justify-center ">
                <nav aria-label="Page navigation example">
                    <ul className="inline-flex -space-x-px">
                        <li>
                            <Link
                            style={currentPage == 1 ?  {pointerEvents: "none"} : {}}
                                to={`../../patient/${patientId}/history?page=${currentPage - 1}&sortBy=${sortBy}&query=${query}`}
                                className="bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 ml-0 rounded-l-lg leading-tight py-2 px-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                Previous
                            </Link>
                        </li>

                        <li>
                            <Link
                             style={currentPage == totalPage ?  {pointerEvents: "none"} : {}}
                                to={`../../patient/${patientId}/history?page=${currentPage + 1}&sortBy=${sortBy}&query=${query}`}
                                className="bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-r-lg leading-tight py-2 px-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                Next
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
