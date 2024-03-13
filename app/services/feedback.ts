import { AppLoadContext } from "@remix-run/cloudflare";
import { api } from "./api";

export interface FeedbackObject {
    doctorPoint: number;
    appointmentPoint: number;
    comment: string;
}

export async function AddFeedBack(feedback: FeedbackObject, appId: string, context: AppLoadContext) {
    try {
        return await api(context)
            .post(`api/feedback/add/${appId}`, {
                json: feedback,
            })
            .text();
    } catch (error) {
        throw error;
    }
}

export async function GetDoctorFeedback(id: number,page : number ,context: AppLoadContext) {
    try {
        return await api(context).get(`api/feedback/view/doctor/${id}?page=${page}`, {}).json();
    } catch (error) {
        throw error;
    }
}
