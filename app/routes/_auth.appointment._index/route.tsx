import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { Pagination } from "flowbite-react";
import { HTTPError } from "ky";

import { AppointmentTable } from "./AppointmentTable";

import { Select } from "~/components/Select";
import { getAllPendingAndApprovedAppointments } from "~/services/appointment";
import { APP_STATUS } from "~/types/appointment";
import { requireUser } from "~/utils/function/UserUtils";

export async function loader({ request, context }: LoaderFunctionArgs) {
    await requireUser(request);

    const url = new URL(request.url);
    const pageNo = url.searchParams.get("pageNo") ?? "1";
    const status = url.searchParams.get("status") ?? APP_STATUS.ALL.toString();

    try {
        const pageAppointment = await getAllPendingAndApprovedAppointments(context, parseInt(pageNo), parseInt(status));

        return json({ ...pageAppointment, status });
    } catch (error) {
        if (error instanceof HTTPError) {
            if (error.response.status == 404) {
                return json({
                    status,
                    currentPage: 0,
                    totalPage: 0,
                    appointments: [],
                });
            }

            throw new Response(
                JSON.stringify({
                    error: error?.message,
                }),
                { status: error?.response?.status ?? 500 },
            );
        }

        throw json(
            {
                error: "Unknown error",
            },
            {
                status: 500,
            },
        );
    }
}

const statusOptions = [
    { value: APP_STATUS.ALL, text: "All" },
    { value: APP_STATUS.PENDING, text: "Pending" },
    { value: APP_STATUS.APPROVED, text: "Approved" },
];

export default function AppointmentPage() {
    const { status, appointments, currentPage, totalPage } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Appointments</h1>
            <div className="mt-4">
                <Form method="GET" className="flex gap-5">
                    <fieldset className="flex flex-col gap-1">
                        <label className="text-md font-medium text-gray-900 dark:text-white" htmlFor="status">
                            Status
                        </label>

                        <Select name="status" defaultValue={status} options={statusOptions} width="w-32" />
                    </fieldset>

                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium rounded-lg place-self-end bg-indigo-500 text-slate-50 hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-800 focus-visible:ring-opacity-75"
                    >
                        Search
                    </button>
                </Form>

                <div className="mt-4">
                    <AppointmentTable appointments={appointments} currentPage={currentPage} />

                    {appointments?.length == 0 && (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-lg font-medium text-gray-900 dark:text-white">No appointment found</p>
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
            </div>
        </div>
    );
}
