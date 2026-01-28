/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#020617', // Slate 950
                surface: '#0f172a',    // Slate 900
                primary: {
                    light: '#38bdf8',    // Sky 400
                    DEFAULT: '#0ea5e9',  // Sky 500
                    dark: '#0284c7',     // Sky 600
                },
                secondary: '#6366f1',  // Indigo 500
                accent: '#f43f5e',     // Rose 500
                glass: 'rgba(15, 23, 42, 0.6)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
