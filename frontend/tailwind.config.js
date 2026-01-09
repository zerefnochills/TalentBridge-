/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark glassmorphism theme (from uioftalent)
                dark: {
                    main: '#060515',
                    secondary: '#110e31',
                    card: 'rgba(255, 255, 255, 0.05)',
                    border: 'rgba(255, 255, 255, 0.1)',
                },
                // Primary purple/indigo gradient colors
                primary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#818CF8',
                    600: '#6366f1',
                    700: '#5b21b6',
                    800: '#4c1d95',
                    900: '#3c1a7e',
                },
                // Accent colors for gradients
                accent: {
                    pink: '#f472b6',
                    rose: '#fb7185',
                    purple: '#a855f7',
                    blue: '#3b82f6',
                    cyan: '#2dd4bf',
                    teal: '#14b8a6',
                },
                // Text colors
                text: {
                    main: '#F8FAFC',
                    muted: '#94A3B8',
                },
                // Status colors
                success: '#2DD4BF',
                warning: '#FBBF24',
                danger: '#F87171',
            },
            backgroundImage: {
                'gradient-main': 'linear-gradient(135deg, #060515 0%, #110e31 100%)',
                'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
                'gradient-accent': 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)',
                'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            },
            boxShadow: {
                '3d': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
                'glow-lg': '0 0 40px rgba(99, 102, 241, 0.6)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'drawer': '-10px 0 30px rgba(0, 0, 0, 0.5)',
            },
            backdropBlur: {
                xs: '2px',
                glass: '20px',
            },
            borderRadius: {
                '2xl': '16px',
                '3xl': '24px',
            },
            spacing: {
                'sidebar': '240px',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-down': 'slideDown 0.4s ease-out',
                'slide-left': 'slideLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-right': 'slideRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                'scale-in': 'scaleIn 0.3s ease-out',
                'bounce-slow': 'bounce 3s infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'gradient': 'gradient 3s ease infinite',
                'gauge-fill': 'gaugeFill 1s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideLeft: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideRight: {
                    '0%': { transform: 'translateX(0)', opacity: '1' },
                    '100%': { transform: 'translateX(100%)', opacity: '0' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                gaugeFill: {
                    '0%': { strokeDashoffset: '141.4' },
                    '100%': { strokeDashoffset: 'var(--gauge-offset)' },
                },
            },
        },
    },
    plugins: [],
}
