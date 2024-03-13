import Feature from "./Feature";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Hero from "./Hero";
import Testimonials from "./Testimonials";
import { Link, useRouteLoaderData } from "@remix-run/react";
import type { User } from "~/types";

export default function Index() {
    const { user } = useRouteLoaderData("root") as { user: User | null };

    return (
        <div>
            <Header user={user} />
            <Hero />
            <Feature />
            <Testimonials />

            <div className="bg-slate-50">
                <div className="max-w-6xl px-4 py-4 mx-auto text-center sm:px-6 lg:px-8 lg:py-20">
                    <h2 className="p-4 rounded-nonexl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
                        Ready to get your problem solved?
                    </h2>

                    <Link
                        to="/signup"
                        className="border-theme-700 border-2 hover:bg-theme-500 inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
                    >
                        Get started
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
