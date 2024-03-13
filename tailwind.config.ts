import type { Config } from "tailwindcss";
const { blackA, green, mauve, violet } = require("@radix-ui/colors");

export default {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                ...blackA,
                ...green,
                ...mauve,
                ...violet,

                theme: {
                    100: "#EDF2FB",
                    200: "#E2EAFC",
                    300: "#D7E3FC",
                    400: "#CCDBFD",
                    500: "#C1D3FE",
                    600: "#B6CCFE",
                    700: "#ABC4FF",
                    800: "#99b6fb",
                    900: "#7F9AF9",
                },
            },
        },
    },

    plugins: [
        require("flowbite/plugin")
    ],
} satisfies Config;
