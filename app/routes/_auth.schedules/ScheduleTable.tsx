import { Table } from "flowbite-react";
import dayjs from "dayjs";
import ShiftModal from "./ShiftModal";
import type { Shift } from "~/types/shift";
import type { MedstaffMetadata } from "~/types";

export default function ScheduleTable({ shifts, employees }: { shifts: Shift[]; employees: MedstaffMetadata[] }) {
    return (
        <div className="flex flex-col">
            <div className="my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b border-gray-200 dark:border-gray-700 shadow sm:rounded-lg">
                        <Table hoverable className="m-0 table-fixed">
                            <Table.Head className="text-center">
                                <Table.HeadCell scope="col" className="px-6 py-3 w-20">
                                    #
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-6 py-3 w-60">
                                    Date
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-6 py-3">
                                    Shift
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-6 py-3 w-40 text-center">
                                    Actions
                                </Table.HeadCell>
                            </Table.Head>

                            <Table.Body className="divide-y">
                                {shifts.map((shift, i) => (
                                    <TableRow key={shift.id} shift={shift} employees={employees} i={i} />
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TableRow = ({ i, shift, employees }: { i: number; shift: Shift; employees: MedstaffMetadata[] }) => (
    <Table.Row key={shift.id} className="bg-white hover:bg-gray-50 dark:hover:bg-gray-600">
        <Table.Cell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white text-center">{i + 1}</Table.Cell>

        <Table.Cell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white text-center">
            {dayjs(shift.start).format("MM/DD/YYYY")}
        </Table.Cell>

        <Table.Cell className="px-6 py-4 text-sm text-gray-900 dark:text-gray-400 text-center">
            {dayjs(shift.start).format("HH:mm")} - {dayjs(shift.start).add(4, "hour").format("HH:mm")}
        </Table.Cell>

        <Table.Cell className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap flex justify-center">
            <ShiftModal shift={shift} employees={employees} />
        </Table.Cell>
    </Table.Row>
);
