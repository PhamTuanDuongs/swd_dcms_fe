import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Form } from "@remix-run/react";

export function CancelAppointment({ appointmentId }: { appointmentId: number }) {
    const [open, setOpen] = React.useState(false);

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Trigger asChild>
                <button
                    onClick={(e) => {
                        setOpen(true);
                    }}
                    className="bg-red-500 hover:bg-red-500 text-white font-bold py-2 px-4 rounded block m-3 w-1/2"
                >
                    Cancel
                </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
                <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">Are you absolutely sure?</AlertDialog.Title>
                    <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
                        This action cannot be undone. This will permanently cancle this appointment.
                    </AlertDialog.Description>
                    <div className="flex justify-end gap-[25px]">
                        <AlertDialog.Cancel asChild>
                            <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                                No
                            </button>
                        </AlertDialog.Cancel>
                        <Form
                            method="DELETE"
                            onSubmit={(e) => {
                                setOpen(false);
                            }}
                        >
                            <div>
                                <input type="hidden" value={appointmentId} name="id" />
                                <button
                                    type="submit"
                                    className="text-red-500 bg-red-200 hover:bg-red-300 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                                >
                                    Yes, cancel appointment
                                </button>
                            </div>
                        </Form>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
