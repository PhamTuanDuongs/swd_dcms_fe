import React, { useEffect } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useFetcher } from "@remix-run/react";
import { Pagination } from "flowbite-react";

import { CommentComponent } from "./CommentComponent";

import Loading from "~/components/loadingspinner";

export function ViewFeedBack({ medstaffId }: { medstaffId: string }) {
    const [open, setOpen] = React.useState(false);
    const comments = useFetcher();
    const active = comments.state !== "idle";
    useEffect(() => {
        if (comments.state === "idle" && !comments.data && open == true) {
            comments.submit({ some: "values" }, { method: "post", action: `/medstaff/${medstaffId}/view` });
        }
    }, [open, comments]);

    const handleMove = (page: number) => {
        comments.submit({ some: "values" }, { method: "post", action: `/medstaff/${medstaffId}/view?page=${page}` });
    };
    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Trigger asChild>
                <button
                    onClick={(e) => {
                        setOpen(true);
                    }}
                    className="text-gray-200 w-full block rounded-lg text-center font-medium leading-6 px-6 py-3 bg-gray-900 hover:bg-black hover:text-white"
                >
                    View feedback
                </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
                <AlertDialog.Content className="data-[state=open]:animate-contentShow overflow-y-scroll fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <AlertDialog.Title className="text-mauve12 m-0 text-[17px] flex justify-between font-medium">
                        Feedback from patient
                        <AlertDialog.Cancel asChild>
                            <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                                X
                            </button>
                        </AlertDialog.Cancel>
                    </AlertDialog.Title>
                    <div className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal ">
                        {open ? (
                            comments.data && !active ? (
                                comments.data?.feedbacks?.map(
                                    (f: { comment: string; metadata: any; doctorPoint: number }, index: number) => {
                                        return (
                                            <div key={index}>
                                                <CommentComponent comment={f.comment} patient={f.metadata} doctorPoint={f.doctorPoint} />
                                            </div>
                                        );
                                    }
                                )
                            ) : (
                                <Loading />
                            )
                        ) : null}
                    </div>
                    <nav aria-label="Page navigation example" className="flex justify-center">
                        {comments?.data?.totalPage > 1 && (
                            <Pagination
                                showIcons
                                currentPage={comments?.data?.currentPage}
                                totalPages={comments?.data?.totalPage}
                                onPageChange={(page) => {
                                    handleMove(page);
                                }}
                            />
                        )}
                    </nav>
                    <div className="flex justify-end gap-[25px]"></div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
