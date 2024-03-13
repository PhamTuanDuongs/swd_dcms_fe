const Footer = () => {
    return (
        <footer className="p-2 bg-theme-200 md:p-4 lg:p-6 dark:bg-gray-800">
            <div className="mx-auto max-w-screen-xl text-center">
                <div className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white">
                    <img src="/images/teeth.webp" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                    Dental clinic
                </div>
                <p className="my-2 text-gray-500 dark:text-gray-400">Dental clinic of dreams.</p>

                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400 flex-nowrap">
                    © 2023 <span className="hover:underline">Dental Clinic™</span>. All Rights Reserved.
                </span>
            </div>
        </footer>
    );
};

export default Footer;
