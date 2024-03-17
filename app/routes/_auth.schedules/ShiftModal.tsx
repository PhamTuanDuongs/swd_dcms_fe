import React, { Fragment, useEffect } from "react";
import { toast } from "react-toastify";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { redirect } from "@remix-run/cloudflare";
import { FetcherWithComponents, useFetcher, useRevalidator } from "@remix-run/react";

import { ROOMS } from "./route";

import type { MedstaffMetadata } from "~/types";
import type { Shift } from "~/types/shift";
import { useIsMount } from "~/utils/hooks";

export default function ShiftModal({ shift, employees }: { shift: Shift; employees: MedstaffMetadata[] }) {
    const fetcher = useFetcher();
    const isMount = useIsMount();
    const [open, setOpen] = React.useState(false);
    const { revalidate } = useRevalidator();

    useEffect(() => {
        if (!isMount && fetcher.state == "idle" && fetcher.data) {
            if (fetcher.data?.ok) {
                toast.success(fetcher.data?.message, {
                    position: "bottom-right",
                });
            } else {
                toast.error(fetcher.data?.message, {
                    position: "bottom-right",
                });
            }
        }
    }, [fetcher, isMount]);

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="text-indigo-600 font-medium leading-none">Edit</button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content className="overflow-y-scroll data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">Edit shift</Dialog.Title>

                    {employees.map((employee) => (
                        <EmployeeRow key={employee.id} employee={employee} shift={shift} fetcher={fetcher} />
                        // <Fragment key={employee.id}>
                        //     <fetcher.Form method="POST" className="flex justify-between items-center gap-4 mb-6">
                        //         <p className="px-2 min-w-8 text-slate-700 text-[15px]">{employee.userDTO.metadata.name}</p>
                        //         <select
                        //             disabled={fetcher.state === "submitting"}
                        //             onChange={(e) =>
                        //                 fetcher.submit(
                        //                     {
                        //                         room: e.target.value,
                        //                         metadataId: employee?.userDTO?.metadata?.id?.toString() ?? "",
                        //                         shiftId: shift.id.toString(),
                        //                     },
                        //                     { method: "POST" }
                        //                 )
                        //             }
                        //             defaultValue={
                        //                 shift?.staffShifts?.find((staffShift) => staffShift.staff.id === employee.id)?.room ?? "None"
                        //             }
                        //             className="inline-block w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        //         >
                        //             {ROOMS.map((room) => (
                        //                 <option key={room} value={room}>
                        //                     {room}
                        //                 </option>
                        //             ))}
                        //         </select>
                        //     </fetcher.Form>

                        //     <AlertDialog.Root open={open} onOpenChange={setOpen}>
                        //         <AlertDialog.Trigger asChild>
                        //             <button
                        //                 disabled={
                        //                     (shift?.staffShifts?.find((staffShift) => staffShift.staff.id === employee.id)?.room ??
                        //                         "None") == "None"
                        //                 }
                        //                 onClick={() => {
                        //                     setOpen(true);
                        //                 }}
                        //                 style={{ marginLeft: "50px" }}
                        //                 className="disabled:cursor-not-allowed btn btn-danger border-spacing-5 text-red-600 bg-gray-50 hover:bg-red-200 border-red-600 h-10 w-20 text-center text-sm border-2 rounded-sm"
                        //             >
                        //                 Delete
                        //             </button>
                        //         </AlertDialog.Trigger>
                        //         <AlertDialog.Portal>
                        //             <AlertDialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 " />
                        //             <AlertDialog.Content className=" data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                        //                 <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                        //                     Are you absolutely sure?
                        //                 </AlertDialog.Title>
                        //                 <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
                        //                     This action cannot be undone.
                        //                 </AlertDialog.Description>
                        //                 <div className="flex justify-end gap-[25px]">
                        //                     <AlertDialog.Cancel asChild>
                        //                         <button className=" bg-theme-200 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                        //                             Cancel
                        //                         </button>
                        //                     </AlertDialog.Cancel>
                        //                     <fetcher.Form method="POST">
                        //                         <button
                        //                             disabled={fetcher.state === "submitting"}
                        //                             onClick={async (e) => {
                        //                                 console.log(employee?.userDTO?.metadata?.id?.toString());
                        //                                 fetcher.submit(
                        //                                     {
                        //                                         room: "None",
                        //                                         metadataId: employee?.userDTO?.metadata?.id?.toString() ?? "",
                        //                                         shiftId: shift.id.toString(),
                        //                                     },
                        //                                     { method: "POST" }
                        //                                 );
                        //                             }}
                        //                             className="text-red-600 bg-gray-50 border-red-600 hover:bg-red-200 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px] border-2"
                        //                         >
                        //                             Delete
                        //                         </button>
                        //                     </fetcher.Form>
                        //                 </div>
                        //             </AlertDialog.Content>
                        //         </AlertDialog.Portal>
                        //     </AlertDialog.Root>
                        // </Fragment>
                    ))}

                    <Dialog.Close asChild>
                        <button
                            className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                            aria-label="Close"
                        >
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

const EmployeeRow = ({ employee, shift, fetcher }: { employee: MedstaffMetadata; shift: Shift; fetcher: FetcherWithComponents<any> }) => (
    <fetcher.Form method="POST" className="flex justify-between items-center gap-4 mb-6">
        <p className="px-2 min-w-8 text-slate-700 text-[15px]">{employee.userDTO.metadata.name}</p>
        <select
            disabled={fetcher.state === "submitting"}
            onChange={(e) =>
                fetcher.submit(
                    {
                        room: e.target.value,
                        metadataId: employee?.userDTO?.metadata?.id?.toString() ?? "",
                        shiftId: shift.id.toString(),
                    },
                    { method: "POST" },
                )
            }
            defaultValue={shift?.staffShifts?.find((staffShift) => staffShift.staff.id === employee.id)?.room ?? "None"}
            className="inline-block w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
            {ROOMS.map((room) => (
                <option key={room} value={room}>
                    {room}
                </option>
            ))}
        </select>

        <button
            disabled={fetcher.state === "submitting"}
            onClick={async (e) => {
                console.log(employee?.userDTO?.metadata?.id?.toString());
                fetcher.submit(
                    {
                        room: "None",
                        metadataId: employee?.userDTO?.metadata?.id?.toString() ?? "",
                        shiftId: shift.id.toString(),
                    },
                    { method: "POST" },
                );
            }}
            className="text-red-600 bg-gray-50 border-red-600 hover:bg-red-200 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px] border-2"
        >
            Delete
        </button>
    </fetcher.Form>
);
