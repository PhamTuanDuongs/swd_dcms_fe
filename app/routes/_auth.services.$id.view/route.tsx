import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { getServiceById } from "~/services/service";
import type { Service } from "~/types";
export async function loader({ params, context }: LoaderFunctionArgs) {
    if (typeof params?.id !== "undefined") {
        const service = await getServiceById(context, params?.id);

        if (!service) throw new Response("Service not found", { status: 404, statusText: "Service not found" });

        return service;
    } else {
        throw new Response("Service not found", { status: 404, statusText: "Service not found" });
    }
}

export default function List() {
    const service = useLoaderData<typeof loader>();
    return <ServiceDetail service={service} />;
}
function ServiceDetail({ service }: { service: Service }) {
    return (
        <>
            <div className="p-8 justify-center items-center place-self-center justify-self-center">
                <h1 className="text-center text-3xl font-semibold text-gray-900 dark:text-white">Services Detail</h1>
                <div className="p-4"></div>
                <div className=" bg-violet-100  w-[800px]   pt-4">
                    <div className="name mt-6  pl-10">
                        <fieldset className="mb-[15px] flex  gap-5">
                            <label className="text-violet11   text-[15px] right-20  font-bold" htmlFor="name">
                                Service: <label className="text-black w-[700px]  text-[15px]  font-bold"> {service.name}</label>
                            </label>
                        </fieldset>
                    </div>
                    <div className="name mt-6 pl-10">
                        <fieldset className="mb-[15px] flex gap-5">
                            <label className="text-violet11   text-[15px] right-20  font-bold" htmlFor="price">
                                Price: <label className="text-black w-[700px]  text-[15px]  font-bold"> {service.price}</label>
                            </label>
                        </fieldset>
                    </div>
                    <div className="name mt-6 pl-10 mb-4 pb-3">
                        <fieldset className="mb-[15px] flex gap-5">
                            <label className="text-violet11   text-[15px] right-20  font-bold" htmlFor="description">
                                Description:
                            </label>
                            <label className="text-black w-[600px] text-[15px]  font-bold p-5 text-justify"> {service.description}</label>
                        </fieldset>
                    </div>
                </div>
            </div>
        </>
    );
}
