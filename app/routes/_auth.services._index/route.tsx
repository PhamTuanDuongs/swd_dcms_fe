import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { Pagination } from "flowbite-react";
import { HTTPError } from "ky";

import { AddServiceDrawer } from "./AddServiceDrawer";
import { ServiceTable } from "./ServiceTable";
import { ToastMessage } from "./Toast";

import { deteleServiceById, findAllUndeletedServicesByName } from "~/services/service";
import { requireAdmin } from "~/utils/function/UserUtils";

export async function loader({ context, request }: LoaderFunctionArgs) {
    await requireAdmin(request);

    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? "";
    const pageNo = url.searchParams.get("pageNo") ?? "1";

    try {
        const pageService = await findAllUndeletedServicesByName(context, parseInt(pageNo), query);

        return json({
            ...pageService,
            query,
        });
    } catch (error) {
        if (error instanceof HTTPError) {
            if (error.response.status == 404) {
                return json({
                    currentPage: 0,
                    totalPages: 0,
                    services: [],
                    query,
                });
            }

            throw new Response(
                JSON.stringify({
                    error: error?.message,
                }),
                { status: error?.response?.status ?? 500 },
            );
        }

        throw new Response(
            JSON.stringify({
                error: "Unknown error",
            }),
            { status: 500 },
        );
    }
}

export async function action({ request, context }: ActionFunctionArgs) {
    const body = await request.formData();
    const id = body.get("id") as string;
    try {
        await deteleServiceById(context, id);
        return json({
            message: "Deleted service successfully",
        });
    } catch {
        return json(
            {
                message: "Failed to delete service",
            },
            {
                status: 400,
            },
        );
    }
}

export default function ListServicesPage() {
    const { services, currentPage, totalPages, query } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const status = useActionData<typeof action>();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Services</h1>
            <div className="mt-4">
                <Form method="GET" className="flex gap-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-md font-medium text-gray-900 dark:text-white">Name</label>

                        <input
                            type="text"
                            name="q"
                            defaultValue={query}
                            className="w-64 py-2 border-gray-300 rounded-lg dark:border-gray-700 focus:ring-theme-500 focus:border-theme-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="self-end px-4 py-2 text-sm font-semibold bg-indigo-500 rounded-lg text-slate-50 hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                    >
                        Search
                    </button>

                    <AddServiceDrawer />
                </Form>

                <div className="mt-4">
                    <ServiceTable services={services} currentPage={currentPage} />

                    {services.length == 0 && (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-lg font-medium text-gray-900 dark:text-white">No services found</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-end">
                        <Pagination
                            showIcons
                            currentPage={currentPage}
                            onPageChange={(page) => navigate(`.?pageNo=${page}&q=${query}`)}
                            totalPages={totalPages}
                        />
                    </div>
                )}
            </div>
            <ToastMessage status={status} />
        </div>
    );
}
