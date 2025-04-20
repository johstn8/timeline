/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#eef2ff',
                    500: '#6366f1',
                    700: '#4338ca',
                    800: '#3b4352',
                    900: '#14171c',
                },
                darkmode_page: '#111827',
                darkmode_header_footer: '#2d3748',
                lightmode_page: '#e4e5f1',
                lightmode_header_footer: '#c7d9f0',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
