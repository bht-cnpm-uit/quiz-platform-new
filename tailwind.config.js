/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './configs/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            spacing: {
                'h-header': 'var(--h-header)',
                'w-sidebar': '250px',
            },
            maxWidth: {
                container: '1200px',
            },
            boxShadow: {
                test: '0 0 1px 1px red',
            },
            colors: {
                primary: '#a174ff',
                'primary-dark': '#845bd8',
            },
        },
        screens: {
            xxl: { min: '1400px' },
            xl: { max: '1399px' },
            lg: { max: '1199px' },
            md: { max: '991px' },
            sm: { max: '767px' },
            xs: { max: '575px' },
            'can-hover': { raw: '(hover: hover)' },
            'cannot-hover': { raw: '(hover: none)' },
        },
    },
    plugins: [],
};
