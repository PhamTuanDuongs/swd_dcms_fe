import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Form, useSubmit } from "@remix-run/react";
import { Rating, ThinStar } from "@smastrom/react-rating";
import { z } from "zod";

import { FeedbackObject } from "~/services/feedback";

export const FeedbackSchema = z.object({
    id: z.string(),
    doctorPoint: z.string(),
    appointmentPoint: z.string(),
    comment: z.string().trim().max(500, "Comment must be below 500 character"),
});

type FeedbackInput = z.infer<typeof FeedbackSchema>;
export function Feedback({ feedback, user, appointmentId }: any) {
    const [open, setOpen] = React.useState(false);
    const [doctorPoint, setdoctorPoint] = React.useState(feedback?.doctorPoint || 0);
    const [appointmentPoint, setappointmentPoint] = React.useState(feedback?.appointmentPoint || 0);
    const [comment, setComment] = React.useState(feedback?.comment || " ");

    const submit = useSubmit();
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm<FeedbackInput>({
        resolver: zodResolver(FeedbackSchema),
        mode: "onChange",
        defaultValues: {},
    });

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Trigger asChild>
                <button
                    onClick={(e) => {
                        setOpen(true);
                    }}
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded block m-3 w-full"
                >
                    Feedback
                </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
                <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">Are you absolutely sure?</AlertDialog.Title>
                    <div className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
                        <div>
                            <span>Rating Doctor: </span>
                            <Rating
                                style={{ maxWidth: 150 }}
                                itemStyles={{ itemShapes: ThinStar, activeFillColor: "#ffb700", inactiveFillColor: "#fbf1a9" }}
                                value={doctorPoint}
                                onChange={setdoctorPoint}
                                readOnly={user != "PATIENT" ? true : false}
                            />
                            <span>Rating Appointment: </span>
                            <Rating
                                style={{ maxWidth: 150 }}
                                itemStyles={{ itemShapes: ThinStar, activeFillColor: "#ffb700", inactiveFillColor: "#fbf1a9" }}
                                value={appointmentPoint}
                                onChange={setappointmentPoint}
                                readOnly={user != "PATIENT" ? true : false}
                            />
                            <Form
                                method="PUT"
                                onSubmit={handleSubmit(async (value) => {
                                    const isValid = await trigger(undefined, { shouldFocus: true });
                                    if (isValid) {
                                        setOpen(false);
                                        submit(value, { method: "PUT" });
                                    }
                                })}
                            >
                                <input type="hidden" value={appointmentId} {...register("id", { required: true })} />
                                <input type="hidden" value={doctorPoint} {...register("doctorPoint", { required: true })}></input>
                                <input type="hidden" value={appointmentPoint} {...register("appointmentPoint", { required: true })}></input>
                                <div>
                                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Your Comment{" "}
                                    </label>
                                    <textarea
                                        {...register("comment", { required: true })}
                                        disabled={user != "PATIENT" ? true : false}
                                        defaultValue={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        id="message"
                                        className="block p-2.5 h-32 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Write your thoughts here..."
                                    ></textarea>
                                    {errors?.comment?.message && (
                                        <p className="text-red-600 mb-[15px] flex items-center">{errors.comment.message}</p>
                                    )}
                                </div>
                                <div className="flex justify-end gap-[25px] mt-7">
                                    <div>
                                        {user != "PATIENT" || (
                                            <button
                                                type="submit"
                                                className="text-red-500 bg-red-200 hover:bg-red-300 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                                            >
                                                Yes, Add Feedback
                                            </button>
                                        )}
                                    </div>

                                    <AlertDialog.Cancel asChild>
                                        <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                                            No
                                        </button>
                                    </AlertDialog.Cancel>
                                </div>
                            </Form>
                        </div>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
