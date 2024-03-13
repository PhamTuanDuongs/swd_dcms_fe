import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Form, useNavigation, useSubmit } from "@remix-run/react";

export default function DeleteButton(props: any) {
    const [open, setOpen] = React.useState(false);
    const transition = useNavigation();
    const active = transition.state !== "idle";
    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Trigger asChild>
                <p
                    onClick={(e) => {
                        setOpen(true);
                    }}
                    className="text-red-500 hover:cursor-pointer font-medium"
                >
                    Delete
                </p>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 " />
                <AlertDialog.Content className=" data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">Are you absolutely sure?</AlertDialog.Title>
                    <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
                        This action cannot be undone. This will permanently delete employee.
                    </AlertDialog.Description>
                    <div className="flex justify-end gap-[25px]">
                        <AlertDialog.Cancel asChild>
                            <button className=" bg-theme-200 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                                Cancel
                            </button>
                        </AlertDialog.Cancel>

                        <Form
                            action="/employees"
                            method="delete"
                            onSubmit={(e) => {
                                setOpen(false);
                            }}
                        >
                            <input type="hidden" name="id" value={props.employeeId}></input>
                            <button
                                type="submit"
                                className="text-red-600 bg-red-100 hover:bg-red-200 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                            >
                                Yes, delete employee
                            </button>
                        </Form>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
