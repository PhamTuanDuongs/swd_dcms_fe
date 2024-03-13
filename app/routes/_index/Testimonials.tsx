const TESTIMONIALS = [
    {
        title: "Very relaxing",
        description: `"Usually going to the doctor is scary, but here the relaxed atmosphere is always good, even though it's natural to have a little pain because it's the first time. It's just fun, so I'm not afraid to go to the dentist anymore"`,
        avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png",
        name: "Bonnie Green",
    },
    {
        title: "Great service",
        description: `"I was given good professional, painless treatment, hygienic procedures and really impressed."`,
        avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png",
        name: "Roberta Casas",
    },
    {
        title: "I love the doctor",
        description: `"Excellent doctor !!! Very thorough and caring. I'm terribly afraid of the dentist and she's very sensitive
        to that and goes the extra mile to make you feel comfortable. Love her!."`,
        avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png",
        name: "Jese Leos",
    },
    {
        title: "Good dentist",
        description: `"No pain or problems with my extractions and he goes above and beyond the call of duty to make sure you
        understand what you should do with your teeth and mouth so you do not have future health risks. I found him
        to be very professional and truly caring about your oral health."`,
        avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png",
        name: "Joseph McFall",
    },
];

const Testimonials = () => {
    return (
        <section className="bg-theme-200 dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                        How do our customers feel?
                    </h2>
                </div>
                <div className="grid mb-8 lg:mb-12 lg:grid-cols-2 rounded-2xl overflow-hidden">
                    {TESTIMONIALS.map((item, i) => (
                        <figure
                            key={i}
                            className="flex flex-col justify-center items-center p-8 text-center bg-gray-50 border-b border-gray-200 md:p-12 lg:border-r dark:bg-gray-800 dark:border-gray-700"
                        >
                            <blockquote className="mx-auto mb-8 max-w-2xl text-gray-500 dark:text-gray-400">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                                <p className="my-4">{item.description}</p>
                            </blockquote>
                            <figcaption className="flex justify-center items-center space-x-3">
                                <img loading="lazy" className="w-9 h-9 rounded-full" src={item.avatar} alt="profile" />
                                <div className="space-y-0.5 font-medium dark:text-white text-left">
                                    <div>{item.name}</div>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
