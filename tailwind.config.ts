import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        top: '0 -4px 6px rgba(0, 0, 0, 0.1)', // Customize the shadow values as needed
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'deep-blue': '#4583FF',
        'light-blue': '#C4D7FB',
        'anti-white': '#F4F4F1',
        gray: '#B1B1B1',
        primary: {
          DEFAULT: '#1D4ED8', // Primary Blue
          light: '#3B82F6', // Light Blue
          dark: '#1E40AF', // Dark Blue
        },
        secondary: {
          DEFAULT: '#64748B', // Neutral Gray
          light: '#CBD5E1', // Light Gray
          dark: '#334155', // Dark Gray
        },
        background: {
          DEFAULT: '#F3F4F6', // Light Background
          dark: '#1F2937', // Dark Background
        },
        text: {
          primary: '#111827', // Primary Text Color (Dark Gray/Black)
          secondary: '#4B5563', // Secondary Text Color (Gray)
          light: '#FFFFFF', // Light Text Color (White)
        },
        footer: '#1E3A8A', // Footer Background Color (Dark Blue)
        card: {
          DEFAULT: '#FFFFFF', // Card Background (White)
          dark: '#E5E7EB', // Card Background Dark (Gray)
        },
      },
      screens: {
        'near-lg': '1140px',
        lg: '1230px',
      },
    },
  },
  plugins: [],
};
export default config;
