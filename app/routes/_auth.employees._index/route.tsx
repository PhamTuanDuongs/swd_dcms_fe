import { useEffect, useState } from "react";
import { type ActionFunctionArgs, json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, type ShouldRevalidateFunction, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { Pagination } from "flowbite-react";
import { HTTPError } from "ky";

import { deleteEmployee, findAllEmployee } from "../../services/medstaff";

import { EmployeeTable } from "./EmployeeTable";

import ToastDemo from "~/components/toatsdemo";
import { requireAdmin } from "~/utils/function/UserUtils";

export async function loader({ context, request }: LoaderFunctionArgs) {
    await requireAdmin(request);
    const url = new URL(request.url);
    const pageNo = url.searchParams.get("pageNo") ?? "1";

    try {
        const pageEmployee = await findAllEmployee(context, parseInt(pageNo));

        return json({
            ...pageEmployee,
        });
    } catch (error) {
        if (error instanceof HTTPError) {
            if (error.response.status == 404) {
                return json({
                    currentPage: 0,
                    totalPages: 0,
                    employees: [],
                });
            }

            throw new Response(
                JSON.stringify({
                    error: error?.message,
                }),
                { status: error?.response?.status ?? 500 }
            );
        }

        throw new Response(
            JSON.stringify({
                error: "Unknown error",
            }),
            { status: 500 }
        );
    }
}

export const shouldValidate: ShouldRevalidateFunction = ({ actionResult, currentUrl, defaultShouldRevalidate }) => {
    return true;
};

export async function action({ request, context }: ActionFunctionArgs) {
    const body = await request.formData();
    const id = body.get("id");
    try {
        await deleteEmployee(id, context);
        return json({ status: 200, message: "Delete succesfully" });
    } catch (error: any) {
        const status = error?.response?.status;
        switch (status) {
            case 400:
                return json({ status: "400", message: "Delete employee failed" });
            default:
                return json({ status: "500", message: "Server error" });
        }
    }
}

export default function List() {
    const [toats, setToats] = useState(false);
    const { currentPage, totalPage, employees } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const data = useActionData<typeof action>();
    useEffect(() => {
        if (data?.status) {
            setToats(true);

            const toast = setTimeout(() => {
                setToats(false);
            }, 3000);

            return () => clearTimeout(toast);
        }
    }, [data]);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Employees</h1>

            <div className="mt-4">
                <Link
                    to="/employees/add"
                    className="self-end ml-auto px-4 py-2 text-sm font-semibold text-center bg-indigo-500 rounded-lg text-slate-50 hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-800 focus-visible:ring-opacity-75"
                >
                    Add Employee
                </Link>

                <div className="mt-8">
                    {employees.length > 0 ? (
                        <EmployeeTable employees={employees} currentPage={currentPage} />
                    ) : (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-lg font-medium text-gray-900 dark:text-white">No employees found</p>
                        </div>
                    )}
                </div>

                {totalPage > 1 && (
                    <div className="flex justify-end">
                        <Pagination
                            showIcons
                            currentPage={currentPage}
                            onPageChange={(page) => navigate(`.?pageNo=${page}`)}
                            totalPages={totalPage}
                        />
                    </div>
                )}

                {toats && <ToastDemo message={data?.status == "200" ? "Delete succesfully" : "Delete failed"} />}
            </div>
        </div>
    );
}
