import { type LoaderArgs, json } from "@remix-run/cloudflare";
import { findAllByNationalId } from "../../services/patient";
import { Form, Link, type ShouldRevalidateFunction, useLoaderData, useNavigate } from "@remix-run/react";
import { requireAdmin } from "~/utils/function/UserUtils";
import { PatientTable } from "./PatientTable";
import { HTTPError } from "ky-universal";
import { Pagination } from "flowbite-react";
import { Select } from "~/components/Select";

export async function loader({ context, request }: LoaderArgs) {
    await requireAdmin(request);
    const url = new URL(request.url);
    const nationalId = url.searchParams.get("nationalId") ?? "";
    const status = url.searchParams.get("status") ?? "all";
    const pageNo = url.searchParams.get("pageNo") ?? "1";

    try {
        const pagePatient = await findAllByNationalId(context, parseInt(pageNo), nationalId, status);

        return json({
            ...pagePatient,
            nationalId,
            status,
        });
    } catch (error) {
        if (error instanceof HTTPError) {
            if (error.response.status == 404) {
                return json({
                    currentPage: 0,
                    totalPages: 0,
                    patients: [],
                    nationalId,
                    status,
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

const statusOptions = [
    { value: "all", text: "All" },
    { value: "register", text: "Registered" },
    { value: "unregister", text: "Unregistered" },
];

export default function List() {
    const { patients, currentPage, totalPages, nationalId, status } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Patients</h1>

            <div className="mt-4">
                <Form method="GET" className="flex gap-5">
                    <fieldset className="flex flex-col gap-1">
                        <label className="text-md font-medium text-gray-900 dark:text-white" htmlFor="role">
                            Register status
                        </label>

                        <Select name="status" width="w-40" defaultValue={status} options={statusOptions} />
                    </fieldset>

                    <div className="flex flex-col gap-1">
                        <label className="text-md font-medium text-gray-900 dark:text-white" htmlFor="name">
                            Identification Number
                        </label>

                        <input
                            type="text"
                            name="nationalId"
                            defaultValue={nationalId}
                            className="px-4 py-2 border-gray-300 rounded-lg dark:border-gray-700 focus:ring-theme-500 focus:border-theme-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium rounded-lg place-self-end bg-indigo-500 text-slate-50 hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-800 focus-visible:ring-opacity-75"
                    >
                        Search
                    </button>

                    <Link
                        to="/patient/add"
                        className="self-end ml-auto px-4 py-2 text-sm font-semibold text-center bg-indigo-500 rounded-lg text-slate-50 hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-800 focus-visible:ring-opacity-75"
                    >
                        Add Patient
                    </Link>
                </Form>

                <div className="mt-8">
                    <div className="justify-center text-center"></div>
                    {patients?.length > 0 ? (
                        <PatientTable patients={patients} currentPage={currentPage} />
                    ) : (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-lg font-medium text-gray-900 dark:text-white">No patients found</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        showIcons
                        currentPage={currentPage}
                        onPageChange={(page) => navigate(`.?pageNo=${page}&nationalId=${nationalId}&status=${status}`)}
                        totalPages={totalPages}
                    />
                )}
            </div>
        </div>
    );
}
