import { Link } from "@remix-run/react";
import { Table } from "flowbite-react";

import { DeleteService } from "./DeleteService";

import type { Service } from "~/types/service";

export const ServiceTable = ({ services, currentPage }: { services: Service[]; currentPage: number }) => {
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

                                <Table.HeadCell scope="col" className="px-6 py-3 w-60">
                                    Name
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-6 py-3">
                                    Description
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-6 py-3 w-40">
                                    Price
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-6 py-3 w-40 text-center">
                                    Actions
                                </Table.HeadCell>
                            </Table.Head>

                            <Table.Body className="divide-y">
                                {services.map((service, i) => (
                                    <TableRow key={service.id} service={service} no={i + 1 + (currentPage - 1) * 10} />
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TableRow = ({ service, no }: { service: Service; no: number }) => (
    <Table.Row key={service.id} className="bg-white hover:bg-gray-50 dark:hover:bg-gray-600">
        <Table.Cell className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900 dark:text-white">{no}</Table.Cell>

        <Table.Cell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
            <div className="line-clamp-2 whitespace-normal">{service.name}</div>
        </Table.Cell>

        <Table.Cell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="line-clamp-2 whitespace-normal">{service?.description}</div>
        </Table.Cell>

        <Table.Cell className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{service.price}</Table.Cell>

        <Table.Cell className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap flex justify-between">
            <Link
                to={`/services/${service.id}/view`}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600"
            >
                View
            </Link>

            <Link
                to={`/services/${service.id}/edit`}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600"
            >
                Edit
            </Link>

            <DeleteService serviceId={service.id as number} />
        </Table.Cell>
    </Table.Row>
);
