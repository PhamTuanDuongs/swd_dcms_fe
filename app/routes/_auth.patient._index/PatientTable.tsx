import { Link } from "@remix-run/react";
import { Table } from "flowbite-react";

import type { Metadata } from "~/types";

export const PatientTable = ({ patients, currentPage }: { patients: Metadata[]; currentPage: number }) => {
    return (
        <div className="flex flex-col">
            <div className="my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b border-gray-200 dark:border-gray-700 shadow sm:rounded-lg">
                        <Table hoverable className="m-0 min-w-full table-fixed">
                            <Table.Head>
                                <Table.HeadCell scope="col" className="px-4 py-3 w-12 text-center">
                                    #
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" className="px-2 py-3 ">
                                    Name
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" className="px-2 py-3 ">
                                    Identification Number
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" className="px-2 py-3">
                                    Date of Birth
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" className="px-2 py-3">
                                    Phone
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" className="px-2 py-3 text-center">
                                    Actions
                                </Table.HeadCell>
                            </Table.Head>

                            <Table.Body className="divide-y">
                                {patients.map((patient, i) => (
                                    <TableRow key={i} patient={patient} no={i + 1 + (currentPage - 1) * 10} />
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TableRow = ({ patient, no }: { patient: Metadata; no: number }) => (
    <Table.Row key={no} className="bg-white hover:bg-gray-50 dark:hover:bg-gray-600">
        <Table.Cell className="px-2 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-900 dark:text-white">{no}</Table.Cell>

        <Table.Cell className="px-2 py-3 text-sm font-medium text-gray-900 dark:text-white">
            <div className="line-clamp-2 whitespace-normal">{patient.name}</div>
        </Table.Cell>

        <Table.Cell className="px-2 py-3  text-sm text-gray-500 dark:text-gray-400">
            <div className="line-clamp-2 whitespace-normal">{patient.nationalId}</div>
        </Table.Cell>

        <Table.Cell className="px-2 py-3  text-sm text-gray-500 whitespace-nowrap">{patient.dob}</Table.Cell>
        <Table.Cell className="px-2 py-3  text-sm text-gray-500 whitespace-nowrap">{patient.phoneNo}</Table.Cell>

        <Table.Cell className="px-2 py-3  text-sm font-medium text-center whitespace-nowrap flex justify-between">
            <Link
                to={"/patient/" + patient.id + "/update"}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 pl-3"
            >
                Update
            </Link>

            <Link
                to={"/patient/" + patient.id + "/view"}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 pl-3"
            >
                View
            </Link>
        </Table.Cell>
    </Table.Row>
);
