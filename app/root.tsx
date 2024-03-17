import { ToastContainer } from "react-toastify";
import reactToastifyStyles from "react-toastify/dist/ReactToastify.css?url";
import { json, LinksFunction, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import { getMetadata } from "./services/profile";
import { GetCurrentUser } from "./utils/function/UserUtils";
import rootStyles from "./root.css?url";

export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: rootStyles },
        { rel: "stylesheet", href: reactToastifyStyles },
    ];
};

export const meta: MetaFunction = () => {
    return [
        { title: "DCMS" },
        {
            property: "og:title",
            content: "DCMS",
        },
        {
            property: "og:description",
            content: "Appointment Booking App",
        },
        {
            name: "description",
            content: "Appointment Booking App",
        },
    ];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
    const user = await GetCurrentUser(request);

    if (!user) {
        return json({
            user: null,
        });
    }

    const userData = await getMetadata(context, user);

    return json({
        user: userData,
    });
}

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <link rel="shortcut icon" href="/images/teeth.webp" type="image/webp" />
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <ToastContainer />
            </body>
        </html>
    );
}
