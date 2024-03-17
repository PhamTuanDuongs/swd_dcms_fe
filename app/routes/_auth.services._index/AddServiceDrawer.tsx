import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useFormAction, useNavigate } from "@remix-run/react";
import { Button } from "flowbite-react";

import { ZService } from "../_auth.services.add/route";

import { Drawer } from "~/components/Drawer";

export const AddServiceDrawer = () => {
    const [open, setOpen] = useState(false);
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const addAction = useFormAction("add");

    const {
        register,
        handleSubmit,
        trigger,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ZService),
        defaultValues: {
            name: "",
            price: "0",
            description: "",
        },
    });

    useEffect(() => {
        if (fetcher.state == "idle" && fetcher.data) {
            if (fetcher.data?.ok) {
                toast.success(fetcher.data?.message, {
                    position: "bottom-right",
                });

                setOpen(false);
                reset();
            } else {
                toast.error(fetcher.data?.message, {
                    position: "bottom-right",
                });
            }
        }
    }, [fetcher, navigate, reset]);

    return (
        <div className="self-end ml-auto">
            <Button className="bg-indigo-500 text-slate-50 hover:bg-indigo-600" onClick={() => setOpen(true)}>
                Add a service
            </Button>

            <Drawer title="Add a service" open={open} setOpen={setOpen}>
                <div className="w-full mt-4">
                    <fetcher.Form
                        onSubmit={handleSubmit(async (values) => {
                            const isValid = await trigger(undefined, { shouldFocus: true });
                            if (isValid) fetcher.submit(values, { action: addAction, method: "POST" });
                        })}
                    >
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-white">
                                Name<label className="text-red-600">*</label>
                            </label>
                            <input
                                {...register("name")}
                                id="name"
                                type="text"
                                className="px-4 py-2 border-gray-300 rounded-lg dark:border-gray-700 focus:ring-theme-500 focus:border-theme-500"
                            />
                            {errors?.name?.message && <p className="text-red-600">{errors.name.message}</p>}

                            <label htmlFor="price" className="text-sm font-medium text-gray-900 dark:text-white">
                                Price<label className="text-red-600">*</label>
                            </label>
                            <input
                                {...register("price")}
                                id="price"
                                type="number"
                                step={0.01}
                                className="px-4 py-2 border-gray-300 rounded-lg dark:border-gray-700 focus:ring-theme-500 focus:border-theme-500"
                            />
                            {errors?.price?.message && <p className="text-red-600">{errors.price.message}</p>}

                            <label htmlFor="description" className="text-sm font-medium text-gray-900 dark:text-white">
                                Description
                            </label>
                            <textarea
                                {...register("description")}
                                id="description"
                                className="px-4 py-2 min-h-[300px] border-gray-300 rounded-lg dark:border-gray-700 focus:ring-theme-500 focus:border-theme-500"
                            />
                            {errors?.description?.message && <p className="text-red-600">{errors.description.message}</p>}

                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium bg-indigo-500 rounded-lg text-slate-50 text-slate-50-600 hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                            >
                                Add
                            </button>
                        </div>
                    </fetcher.Form>
                </div>
            </Drawer>
        </div>
    );
};
