import { Outlet, useRouteLoaderData } from "@remix-run/react";
import { SideNavbar } from "~/components/SideNavbar";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import type { User } from "~/types";

export default function AuthenticatedLayout() {
    const { user } = useRouteLoaderData("root") as { user: User | null };

    return (
        <div className="h-screen min-w-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-theme-100">
            <Header user={user as User | null} />

            <div className="flex flex-grow justify-start items-stretch h-full w-full overflow-hidden relative bg-dots-darker bg-center bg-theme-200-100 dark:bg-dots-lighter dark:bg-gray-900">
                <SideNavbar />

                <div className="flex flex-col justify-between flex-grow w-full overflow-y-scroll">
                    <Outlet />

                    <Footer />
                </div>
            </div>
        </div>
    );
}
