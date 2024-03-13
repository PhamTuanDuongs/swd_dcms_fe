import { Link } from "@remix-run/react";
import dayjs from "dayjs";
import { Table } from "flowbite-react";
import StatusBadge from "~/components/StatusBadgeComponent";
import type { Appointment } from "~/types/appointment";

export const AppointmentTable = ({ appointments, currentPage }: { appointments: Appointment[]; currentPage: number }) => {
    return (
        <div className="flex flex-col">
            <div className="my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b border-gray-200 dark:border-gray-700 shadow sm:rounded-lg">
                        <Table hoverable className="m-0 min-w-full table-fixed">
                            <Table.Head>
                                <Table.HeadCell scope="col" className="px-6 py-3 w-16 text-center">
                                    #
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-6 py-3">
                                    Patient
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-6 py-3">
                                    Room
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-6 py-3">
                                    Date
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-6 py-3">
                                    Status
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-6 py-3 text-center">
                                    Actions
                                </Table.HeadCell>
                            </Table.Head>

                            <Table.Body className="divide-y">
                                {appointments?.map((appointment, i) => (
                                    <TableRow key={appointment.id} appointment={appointment} no={i + 1 + (currentPage - 1) * 10} />
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TableRow = ({ appointment, no }: { appointment: Appointment; no: number }) => (
    <Table.Row className="bg-white hover:bg-gray-50 dark:hover:bg-gray-600">
        <Table.Cell className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900 dark:text-white">{no}</Table.Cell>

        <Table.Cell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
            <div className="line-clamp-2 whitespace-normal">{appointment.patient.name}</div>
        </Table.Cell>

        <Table.Cell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="line-clamp-2 whitespace-normal">{appointment.room}</div>
        </Table.Cell>

        <Table.Cell className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{dayjs(appointment.date).format("YY-MM-DD")}</Table.Cell>

        <Table.Cell className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
            <StatusBadge status={appointment?.status} />
        </Table.Cell>

        <Table.Cell className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap flex justify-center">
            <Link
                to={`/appointment/${appointment.id}`}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600"
            >
                View
            </Link>

            {/* <Link
                to={`/services/${appointment.id}/edit`}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600"
            >
                Edit
            </Link> */}

            {/* <DeleteService serviceId={appointment.id as number} /> */}
        </Table.Cell>
    </Table.Row>
);
