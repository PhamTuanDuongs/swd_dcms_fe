import { Dialog, Transition } from "@headlessui/react";
import { Fragment, type ReactNode } from "react";
import { RxCross1 } from "react-icons/rx";

interface DrawerProps {
    title: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
    open: boolean;
    setOpen: (input: boolean) => void;
    children: ReactNode;
}

export const Drawer = ({ title, open, setOpen, children, size = "md" }: DrawerProps) => {
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className={`relative w-screen max-w-${size} pointer-events-auto`}>
                                    <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                                        <div className="flex justify-between px-4 sm:px-6">
                                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">{title}</Dialog.Title>

                                            <button
                                                type="button"
                                                className="text-gray-800 rounded-md hover:text-gray-500"
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="sr-only">Close panel</span>
                                                <RxCross1 className="w-6 h-6" aria-hidden="true" />
                                            </button>
                                        </div>
                                        <div className="relative flex-1 px-4 mt-6 sm:px-6">{children}</div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
