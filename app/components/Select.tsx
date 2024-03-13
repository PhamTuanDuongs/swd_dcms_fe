import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { RxCaretSort, RxCheck } from "react-icons/rx";

interface Option {
    text: string;
    value: string | number;
}

interface SelectProps {
    name: string;
    defaultValue: string;
    width: string;
    options: Option[];
}

export const Select = ({ name, defaultValue, options, width }: SelectProps) => {
    return (
        <Listbox name={name} defaultValue={defaultValue}>
            <div className={`relative mt-1 z-50 ${width}`}>
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    {({ value }) => (
                        <>
                            <span className="block truncate">{options.find((option) => option.value == value)?.text}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <RxCaretSort className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </>
                    )}
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.map((item, i) => (
                            <Listbox.Option
                                key={i}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? "bg-theme-100 text-theme-900" : "text-gray-900"
                                    }`
                                }
                                value={item.value}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{item.text}</span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-theme-600">
                                                <RxCheck className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};
