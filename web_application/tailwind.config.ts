const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: ['class'], // we currently use darkmode to style some components differently depending on the current club color
    theme: {
        extend: {
            colors: {
                primary: {
                    '500': 'rgb(var(--color-primary-500))',
                },
                blue: {
                    '500': '#0059FF',
                },
                green: {
                    '500': '#00D13B',
                },
                slate: {
                    '300': '#F7F9FA',
                    '400': '#EBF1F4',
                    '500': '#B5C2C9',
                    '600': '#8C9DA6',
                    '700': '#5B656A',
                    '900': '#050E13',
                },
                red: {
                    '500': '#CE1924',
                },
            },
            fontFamily: {
                sans: ['var(--font-kantumruy)', ...fontFamily.sans],
            },
            fontWeight: {
                semibold: 599,
            },
            boxShadow: {
                card: '0px 22px 36px rgba(5, 14, 19, 0.1)',
                'card-hover': '0px 10px 24px rgba(5, 14, 19, 0.13)',
                success: '0px 4px 4px rgba(0, 209, 59, 0.3)',
                'card-sm': '0px 22px 36px rgba(5, 14, 19, 0.04)',
                button: '0px 4px 0px #B5C2C9, 0px 8px 8px rgba(5, 14, 19, 0.1)',
                step: '0px 2px 0px #B5C2C9, 0px 8px 8px rgba(62, 77, 86, 0.12)',
                input: 'inset 0px 2px 0px #EBF1F4',
                negative: '0px -10px 40px rgba(5, 14, 19, 0.3)',
                'negative-sm': '0px -10px 40px rgba(0, 82, 127, 0.05)',
                'inset-sm': '0px -10px 10px inset rgba(0, 82, 127, 0.03)',
            },
            dropShadow: {
                display: '0px 4px 6px rgba(0, 0, 0, 0.3)',
            },
            keyframes: {
                'move-up': {
                    '0%': {
                        transform: 'translateY(100%)',
                        opacity: 0,
                    },
                    '100%': {
                        transform: 'translateY(0%)',
                        opacity: 1,
                    },
                },
                'fade-in': {
                    '0%': {
                        opacity: 0,
                    },
                    '100%': {
                        opacity: 1,
                    },
                },
                'accordion-down': {
                    from: {
                        height: '0',
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                    to: {
                        height: '0',
                    },
                },
            },
            animation: {
                'move-up': 'move-up 0.3s cubic-bezier(.39,1.42,.43,1)',
                'fade-in': 'fade-in 0.3s ease-in-out',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
