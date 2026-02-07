/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#ffffff', // White
                surface: '#f8fafc',    // Slate 50
                primary: {
                    light: '#ef4444',    // Red 500
                    DEFAULT: '#dc2626',  // Red 600
                    dark: '#b91c1c',     // Red 700
                },
                secondary: '#1e293b',  // Slate 800 (for text)
                accent: '#dc2626',     // Red 600
                border: '#e2e8f0',     // Slate 200
                glass: 'rgba(255, 255, 255, 0.8)',
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
