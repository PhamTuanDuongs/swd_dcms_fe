import { MdOutlineMedicalServices } from "react-icons/md";

const FEATURES = [
    "Professional dental care of the highest standards in a comfortable and relaxed environment.",
    "We utilize up to date dental technologies and techniques to help you achieve a smile that you can be proud of.",
    "Provides on-site oral health care services to schools, corporate, and senior home We bring the dentist to you!",
];

const Feature = () => {
    return (
        <section className="bg-slate-50 dark:bg-gray-900">
            <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                <img
                    className="inline-block rounded-xl w-full dark:hidden"
                    src="/images/smiling-dentist.webp"
                    alt="doctor"
                    loading="lazy"
                />
                <div className="mt-4 md:mt-0">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Why chose us?</h2>
                    {FEATURES.map((item, i) => (
                        <p key={i} className="flex gap-5 items-center mb-6 text-gray-800 md:text-lg dark:text-gray-400">
                            <MdOutlineMedicalServices size={50} />
                            {item}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Feature;
