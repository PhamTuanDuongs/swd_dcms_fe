import { type LoaderArgs, json, type LinksFunction, type V2_MetaFunction } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import styles from "./root.css";
import { GetCurrentUser } from "./utils/function/UserUtils";
import { getMetadata } from "./services/profile";

export const links: LinksFunction = () => [
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
    { rel: "stylesheet", href: styles },
];

export const meta: V2_MetaFunction = () => {
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

export async function loader({ context, request }: LoaderArgs) {
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
                <LiveReload />
                <ToastContainer />
            </body>
        </html>
    );
}
