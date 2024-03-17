import { json, type LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { Pagination } from "flowbite-react";
import { HTTPError } from "ky";

import { ExaminationTable } from "./ExaminationTable";

import { getAllExaminationByAppointId } from "~/services/examination";
import { requireAdmin } from "~/utils/function/UserUtils";
export const meta: MetaFunction = () => {
    return [{ title: "Examination" }];
};
export async function loader({ context, request, params }: LoaderFunctionArgs) {
    await requireAdmin(request);
    const url = new URL(request.url);
    const pageNo = url.searchParams.get("pageNo") ?? "1";
    // const appId = url.searchParams.get("appId") ?? "";
    const appId = params.id ?? "0";

    try {
        const pageExamination = await getAllExaminationByAppointId(context, parseInt(appId), parseInt(pageNo));
        return json({ ...pageExamination, appId });
    } catch (error) {
        if (error instanceof HTTPError) {
            if (error.response.status == 404) {
                return json({
                    currentPage: 0,
                    totalPage: 0,
                    examinations: [],
                    appointment: "",
                    appId: "",
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
export default function List() {
    const { examinations, currentPage, totalPage, appointment, appId } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Examination Results</h1>
            <div className="mt-4 flex justify-end mr-5">
                <Link
                    to={"/examination/add?appId=" + appId}
                    className="self-end ml-auto px-4 py-2 text-sm font-semibold text-center bg-indigo-500 rounded-lg text-slate-50 hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-800 focus-visible:ring-opacity-75"
                >
                    Add Examination
                </Link>
            </div>
            <div className="mt-4">
                <div className="mt-8">
                    {examinations.length > 0 ? (
                        <ExaminationTable examinations={examinations} currentPage={currentPage} appointment={appointment} />
                    ) : (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-lg font-medium text-gray-900 dark:text-white">No examinations found</p>
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
