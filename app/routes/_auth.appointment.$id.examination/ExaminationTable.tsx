import { Link } from "@remix-run/react";
import { Table } from "flowbite-react";

import { type Examination } from "~/types";
import { formatDate } from "~/utils/function/dateUtils";

export const ExaminationTable = ({
    examinations,
    currentPage,
    appointment,
}: {
    examinations: Examination[];
    currentPage: number;
    appointment: any;
}) => {
    return (
        <div className="flex flex-col">
            <div className="my-2 overflow-x-auto sm:-mx-6">
                <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b border-gray-200 dark:border-gray-700 shadow sm:rounded-lg">
                        <Table hoverable className="m-0 min-w-full table-fixed">
                            <Table.Head>
                                <Table.HeadCell scope="col" className="px-4 py-3 w-12 text-center">
                                    #
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" className="py-3 w-5/6"></Table.HeadCell>
                                <Table.HeadCell scope="col" className="px-2 py-3 mr-3 text-end">
                                    Actions
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {examinations.map((examination, i) => (
                                    <TableRow
                                        key={i}
                                        examination={examination}
                                        no={i + 1 + (currentPage - 1) * 5}
                                        appointment={appointment}
                                    />
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};
const TableRow = ({ examination, no, appointment }: { examination: Examination; no: number; appointment: any }) => (
    <Table.Row key={examination.id} className="bg-white hover:bg-gray-50 dark:hover:bg-gray-600">
        <Table.Cell className="px-2 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-900 dark:text-white">{no}</Table.Cell>
        <Table.Cell className="px-11 py-3 rounded-l-lg text-sm font-medium text-gray-900 dark:text-white">
            <div className="flex justify-around h-auto">
                <div className="flex justify-center w-2/3 h-auto">
                    {examination.imgResult ? (
                        <div>
                            <img className="rounded-lg max-w-xs min-h-fit" src={examination.imgResult} alt="Avatar" />
                        </div>
                    ) : (
                        <div>
                            <img
                                className="rounded-lg max-w-xs min-h-fit"
                                src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                                alt="Placeholder"
                            />
                        </div>
                    )}
                </div>
                <div className="w-4/5 h-auto">
                    <div className="">
                        <b className="text-2xl font-semibold">{examination.service.name}</b>
                    </div>
                    <div className="text-sm">
                        <b className="font-bold">Date: </b>
                        {formatDate(appointment.date)}
                    </div>
                    <b className="font-bold">Result: </b>
                    <div className="text-base">{examination.textResult}</div>
                </div>
            </div>
        </Table.Cell>
        <Table.Cell className="py-3text-sm font-medium text-end whitespace-nowrap flex justify-end">
            <Link
                to={"/examination/" + examination.id + "/update"}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600"
            >
                Edit
            </Link>
        </Table.Cell>
    </Table.Row>
);
