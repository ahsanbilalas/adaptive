import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'deep-blue': "#4583FF",
        'light-blue': "#C4D7FB",
        'anti-white': "#F4F4F1",
        'gray': "#B1B1B1",
      },
      screens: {
        'near-lg': '1140px',
        'lg': '1230px',
      },
    },
  },
  plugins: [],
};
export default config;
