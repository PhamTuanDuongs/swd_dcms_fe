import { getServiceById, editService } from "~/services/service";

import { json } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import type { LoaderArgs, ActionArgs } from "@remix-run/cloudflare";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTTPError } from "ky-universal";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ZService = zfd.formData({
    name: zfd.text(z.string().trim().nonempty("Name is required").max(126, "Name must be less than 255 characters")),
    description: zfd
        .text(z.string().trim().max(1000, "Description must be less than 1000 characters").optional())
        .transform((value) => (value ? value : "")),
    price: zfd.numeric(
        z.number().nonnegative("Price must be nonnegative").max(2_000_000_000, { message: "Price must be less than 2,000,000,000" })
    ),
});

export async function loader({ params, context }: LoaderArgs) {
    if (typeof params?.id !== "undefined") {
        const service = await getServiceById(context, params?.id);

        if (!service) throw new Response("Service not found", { status: 404, statusText: "Service not found" });

        return service;
    } else {
        throw new Response("Service not found", { status: 404, statusText: "Service not found" });
    }
}

export async function action({ request, context, params }: ActionArgs) {
    try {
        const { name, description, price } = ZService.parse(await request.formData());

        if (typeof params?.id !== "undefined") {
            const service = {
                id: parseInt(params?.id),
                name,
                description,
                price,
            };

            await editService(context, service);

            return json({ message: "Service updated successfully!", ok: true });
        } else {
            throw new Response("Service not found", { status: 404, statusText: "Service not found" });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return json({ message: "Invalid data", ok: false }, { status: 400 });
        } else if (error instanceof HTTPError) {
            return json({ message: "Failed to update service", ok: false }, { status: error.response.status });
        }
    }
}

export default function EditServicePage() {
    const service = useLoaderData<typeof loader>();

    const fetcher = useFetcher();
    const navigate = useNavigate();

    useEffect(() => {
        if (fetcher.state == "idle" && fetcher.data) {
            if (fetcher.data?.ok) {
                toast.success(fetcher.data?.message, {
                    position: "bottom-right",
                });

                navigate("/services");
            } else {
                toast.error(fetcher.data?.message, {
                    position: "bottom-right",
                });
            }
        }
    }, [fetcher, navigate]);

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ZService),
        defaultValues: {
            name: service.name,
            price: service.price.toString(),
            description: service.description ?? "",
        },
    });

    return (
        <div className="p-8">
            <h1 className="text-center text-3xl font-semibold text-gray-900 dark:text-white w-[500px]">Edit Services {service.name}</h1>
            <div className="mt-4">
                <fetcher.Form
                    method="POST"
                    onSubmit={handleSubmit(async (values) => {
                        const isValid = await trigger(undefined, { shouldFocus: true });
                        if (isValid) fetcher.submit(values, { method: "POST" });
                    })}
                >
                    <div className="flex flex-col space-y-4 w-[500px]">
                        <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-white">
                            Name<label className="text-red-600">*</label>
                        </label>
                        <input
                            {...register("name")}
                            id="name"
                            className="px-4 py-2 rounded-lg border-gray-300 dark:border-gray-700 focus:ring-theme-500 focus:border-theme-500"
                        />
                        {errors?.name?.message && <p className="text-red-600">{errors.name.message}</p>}

                        <label htmlFor="price" className="text-sm font-medium text-gray-900 dark:text-white">
                            Price<label className="text-red-600">*</label>
                        </label>
                        <input
                            {...register("price")}
                            id="price"
                            type="number"
                            className="px-4 py-2 rounded-lg border-gray-300 dark:border-gray-700 focus:ring-theme-500 focus:border-theme-500"
                        />
                        {errors?.price?.message && <p className="text-red-600">{errors.price.message}</p>}

                        <label htmlFor="description" className="text-sm font-medium text-gray-900 dark:text-white">
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            id="description"
                            className="px-4 py-2 min-h-[300px] rounded-lg border-gray-300 dark:border-gray-700 focus:ring-theme-500 focus:border-theme-500"
                        />
                        {errors?.description?.message && <p className="text-red-600">{errors.description.message}</p>}

                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-theme-900 rounded-lg hover:bg-theme-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                        >
                            Edit
                        </button>
                    </div>
                </fetcher.Form>
            </div>
        </div>
    );
}
