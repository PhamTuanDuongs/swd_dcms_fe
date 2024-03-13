import { Outlet } from "@remix-run/react";

import styles from "./authstyle.css";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export default function GuestLayout() {
    return (
        <div className="auth-container">
            <Outlet />
        </div>
    );
}
