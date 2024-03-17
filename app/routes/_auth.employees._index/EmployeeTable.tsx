import { Link } from "@remix-run/react";
import { Table } from "flowbite-react";

import DeleteButton from "./deleteemployee";

import type { Medstaff } from "~/types/medstaff";
import { Employee } from "~/types";
export const EmployeeTable = ({ employees, currentPage }: { employees: Employee[]; currentPage: number }) => {
    return (
        // <div>
        //     <table className="m-0 min-w-full divide-y divide-gray-200 dark:divide-gray-700 sm:rounded-lg">
        //         <thead className="bg-gray-50 dark:bg-gray-800 text-center">
        //             <tr>
        //                 <th
        //                     scope="col"
        //                     className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
        //                 >
        //                     No
        //                 </th>
        //                 <th
        //                     scope="col"
        //                     className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
        //                 >
        //                     Name
        //                 </th>
        //                 <th
        //                     scope="col"
        //                     className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
        //                 >
        //                     Role
        //                 </th>
        //                 <th
        //                     scope="col"
        //                     className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
        //                 >
        //                     Email
        //                 </th>
        //                 <th
        //                     scope="col"
        //                     className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
        //                 >
        //                     Phone
        //                 </th>
        //                 <th
        //                     scope="col"
        //                     className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
        //                 >
        //                     Action
        //                 </th>
        //             </tr>
        //         </thead>
        //         <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
        //             {employees.sort((a, b) => a.userDTO.id - b.userDTO.id).map((employee, i) => (
        //                 <tr key={employee.userDTO.id}>
        //                     <td className="px-6 py-4 whitespace-nowrap">{i + 1}</td>
        //                     <td className="px-6 py-4 whitespace-nowrap">{employee.userDTO.metadata.name}</td>
        //                     <td className="px-6 py-4 whitespace-nowrap">{employee.userDTO.role.name}</td>
        //                     <td className="px-6 py-4 whitespace-nowrap">{employee.userDTO.email}</td>
        //                     <td className="px-6 py-4 whitespace-nowrap">{employee.userDTO.metadata.phoneNo}</td>
        //                     <td className="px-6 py-4 whitespace-nowrap">
        //                         <button className="btn btn-info border-spacing-5  bg-emerald-400 text-white font-bold h-10 w-20 text-center text-sm">
        //                             <Link to={"/employees/update?id=" + employee.userDTO.id}>Update</Link>
        //                         </button>
        //                         <DeleteButton employeeId={employee.userDTO.id} />
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
                                    Role
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-2 py-3">
                                    Email
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" className="px-2 py-3">
                                    Phone
                                </Table.HeadCell>

                                <Table.HeadCell scope="col" className="px-2 py-3 text-center">
                                    Actions
                                </Table.HeadCell>
                            </Table.Head>

                            <Table.Body className="divide-y">
                                {employees.map((employee, i) => (
                                    <TableRow key={employee.id} employee={employee} no={i + 1 + currentPage * 10} />
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TableRow = ({ employee, no }: { employee: Employee; no: number }) => (
    <Table.Row key={employee.id} className="bg-white hover:bg-gray-50 dark:hover:bg-gray-600">
        <Table.Cell className="px-2 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-900 dark:text-white">{no}</Table.Cell>

        <Table.Cell className="px-2 py-3 text-sm font-medium text-gray-900 dark:text-white">
            <div className="line-clamp-2 whitespace-normal">{employee.name}</div>
        </Table.Cell>

        <Table.Cell className="px-2 py-3  text-sm text-gray-500 dark:text-gray-400">
            <div className="line-clamp-2 whitespace-normal">{employee.role}</div>
        </Table.Cell>

        <Table.Cell className="px-2 py-3  text-sm text-gray-500 whitespace-nowrap">{employee.email}</Table.Cell>
        <Table.Cell className="px-2 py-3  text-sm text-gray-500 whitespace-nowrap">{employee.phone}</Table.Cell>

        <Table.Cell className="px-2 py-3  text-sm font-medium text-center whitespace-nowrap flex justify-between">
            <Link
                to={"/employees/update?id=" + employee.id}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 pl-3"
            >
                Update
            </Link>

            <Link
                to={"/employees/view?id=" + employee.id}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 pl-3"
            >
                View
            </Link>
            <DeleteButton employeeId={employee.id} />
        </Table.Cell>
    </Table.Row>
);
