import { Rating, ThinStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import MedStaffProfile from "./MedStaffProfile";
import { LoaderArgs, V2_MetaFunction, redirect, ActionArgs } from "@remix-run/cloudflare";
import { getMedStaffProfile } from "~/services/medstaff";
import { requireUser } from "~/utils/function/UserUtils";
import { useLoaderData } from "@remix-run/react";
import { GetDoctorFeedback } from "~/services/feedback";

export const meta: V2_MetaFunction = () => {
    return [{ title: "Profile" }];
};

export async function loader({ request, context, params }: LoaderArgs) {
    await requireUser(request);
    try {
        const data = await getMedStaffProfile(context, params?.id);
        return data;
    } catch (error) {
        return redirect("/404");
    }
}

export async function action({ request, context, params }: ActionArgs) {
    try {
        const url = new URL(request.url);
        const page = url.searchParams.get("page") || "1";
        const data = await GetDoctorFeedback(parseInt(params?.id || "0"), parseInt(page), context);
        return data;
    } catch (error) {
        return {
            error: "Can't load feedback"
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
