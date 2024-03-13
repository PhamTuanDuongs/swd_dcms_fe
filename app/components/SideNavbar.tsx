import { NavLink } from "@remix-run/react";
import { BsJournalMedical } from "react-icons/bs";
import { BackpackIcon, CalendarIcon } from "@radix-ui/react-icons";
import { RxPerson } from "react-icons/rx";
import { RiUserAddLine } from "react-icons/ri";
import type { ReactNode } from "react";

const ROUTES = [
    {
        path: "/appointment",
        desc: "Appointments",
        icon: <BsJournalMedical />,
    },
    {
        path: "/services",
        desc: "Services",
        icon: <BackpackIcon />,
    },
    {
        path: "/employees",
        desc: "Employees",
        icon: <RxPerson />,
    },
    {
        path: "/employees/add",
        desc: "Add employee",
        icon: <RiUserAddLine />,
    },
    {
        path: "/patient",
        desc: "Patients",
        icon: <BackpackIcon />,
    },
    {
        path: "/schedules",
        desc: "Weekly Schedules",
        icon: <CalendarIcon />,
    },
];

const LinkItem = ({ path, desc, icon }: { path: string; desc: string; icon: ReactNode }) => (
    <NavLink
        to={path}
        end
        className={({ isActive, isPending }) =>
            `flex items-center p-2 text-gray-900 rounded-lg border dark:text-white ${
                isActive
                    ? "bg-theme-100 hover:bg-theme-300 border-theme-900  dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 border-white dark:border-gray-700"
            }}`
        }
    >
        {icon}
        <span className="ml-3">{desc}</span>
    </NavLink>
);

export const SideNavbar = () => {
    return (
        <nav className="h-full p-4 overflow-y-scroll bg-white w-80 dark:bg-gray-800" tabIndex={-1}>
            <h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
            <div className="mt-6 flex flex-col gap-1">
                {ROUTES.map((route) => (
                    <LinkItem key={route.path} path={route.path} desc={route.desc} icon={route.icon} />
                ))}
            </div>
        </nav>
    );
};
