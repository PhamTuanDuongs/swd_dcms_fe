import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Rating, ThinStar } from "@smastrom/react-rating";

import MedStaffProfile from "./MedStaffProfile";

import { GetDoctorFeedback } from "~/services/feedback";
import { getMedStaffProfile } from "~/services/medstaff";
import { requireUser } from "~/utils/function/UserUtils";

export const meta: MetaFunction = () => {
    return [{ title: "Profile" }];
};

export async function loader({ request, context, params }: LoaderFunctionArgs) {
    await requireUser(request);
    try {
        const data = await getMedStaffProfile(context, params?.id);
        return data;
    } catch (error) {
        return redirect("/404");
    }
}

export async function action({ request, context, params }: ActionFunctionArgs) {
    try {
        const url = new URL(request.url);
        const page = url.searchParams.get("page") || "1";
        const data = await GetDoctorFeedback(parseInt(params?.id || "0"), parseInt(page), context);
        return data;
    } catch (error) {
        return {
            error: "Can't load feedback",
        };
    }
}

export default function MedStaffView() {
    const data = useLoaderData<typeof loader>();
    return (
        <div>
            <MedStaffProfile data={data} />
        </div>
    );
}
