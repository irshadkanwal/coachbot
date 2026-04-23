import { type Config } from 'tailwindcss';
import formsPlugin from '@tailwindcss/forms';
import headlessuiPlugin from '@headlessui/tailwindcss';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      medium: ['1.25rem', { lineHeight: '1.75rem' }],
      xl: ['1.5rem', { lineHeight: '1.9rem' }],
      '2xl': ['1.75rem', { lineHeight: '2rem' }],
      '3xl': ['2rem', { lineHeight: '2.5rem' }],
      '4xl': ['2.5rem', { lineHeight: '3rem' }],
      '5xl': ['3rem', { lineHeight: '1.1' }],
      '6xl': ['3.5rem', { lineHeight: '1' }],
      '7xl': ['4rem', { lineHeight: '1.1' }],
      '8xl': ['4.6rem', { lineHeight: '1.1' }],
    },
    extend: {
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            p: {
              marginTop: '0rem',
              marginBottom: '0rem',
              fontSize: '1rem',
            },
          },
        },
      }),
      animation: {
        'fade-in': 'fade-in 1s var(--animation-delay, 0s) ease-in-out forwards',
        'fade-in-up': 'fadeInUp  .5s var(--animation-delay, 0s) ease-out backwards',
        'letter-color-change': 'colorChange 1.5s infinite',
        wiggle: 'wiggle 300ms ease-in-out infinite',
        jump: 'jump 1s ease-in-out',
        'scale-pulse': 'scale-pulse 1.5s linear infinite',
        'spin-and-pulse': 'spin-and-pulse 2s linear infinite',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      colors: {
        'main': 'rgb(var(--colors-main), <alpha-value>)',
        'gray-border': 'var(--colors-gray-border)',
        violet: {
          950: 'rgb(var(--colors-violet-950), <alpha-value>)',
        },
        salmon: 'rgb(var(--colors-salmon), <alpha-value>)',
        aquamarine: 'rgb(var(--colors-aquamarine), <alpha-value>)',
        'dark-aquamarine': 'rgb(var(--colors-dark-aquamarine), <alpha-value>)',
        'light-aquamarine': 'rgb(var(--colors-light-aquamarine), <alpha-value>)',
        grape: 'rgb(var(--colors-grape), <alpha-value>)',
        saffron: 'rgb(var(--colors-saffron), <alpha-value>)',
        'dark-blue': 'rgb(var(--colors-dark-blue), <alpha-value>)',
        'light-gray': 'rgb(var(--colors-light-gray), <alpha-value>)',
        'dark-gray': 'rgb(var(--colors-dark-gray), <alpha-value>)',
        'storm-gray': 'rgb(var(--colors-storm-gray), <alpha-value>)',
        yellow: 'rgb(var(--colors-yellow), <alpha-value>)',
        gunmetal: 'rgb(var(--colors-gunmetal), <alpha-value>)',
        mint: 'rgb(var(--colors-mint), <alpha-value>)',
        mauve: 'rgb(var(--colors-mauve), <alpha-value>)',
        golden: 'rgb(var(--colors-golden), <alpha-value>)',
        'white-opacity-1': 'var(--colors-white-opacity-1)',
        'white-opacity-2': 'var(--colors-white-opacity-2)',
        'white-opacity-3': 'var(--colors-white-opacity-3)',
        graphic: 'var(--colors-bg-graphic)',
        'primary-green': '#3ABEB8'
      },
      blur: {
        '4xl': '6rem',
      },
      height: {
        viewport: 'calc(var(--vh))',
      },
      fontFamily: {
        sans: 'var(--font-helvetica-now)',
        cbi: ['var(--font-cbi)'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(89.35deg, #3085B2 -154.84%, #34B691 98.19%)',
        'fade-gradient': 'linear-gradient(0deg, rgba(4, 0, 20, 0.9) 0%, rgba(4, 0, 20, 0) 100%)',
        'green-yellow-gradient': 'linear-gradient(104deg, #3ABEB8 -5.07%, #F9BE19 96.12%)',
      },
      keyframes: {
        'fade-in': {
          from: {
            opacity: '0',
            transform: 'translateY(150%)',
            scale: 'var(--initial-scale, .7)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
            scale: '1',
          },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        colorChange: {
          '0%, 100%': { color: '#72EEDC' },
          '50%': { color: '#15A0A2' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        jump: {
          '0%, 100%': { transform: 'scale(1)' },
          '10%': { transform: 'scale(.8)' },
          '50%': { transform: 'scale(1.4)' },
        },
        'scale-pulse': {
          '0%': { transform: 'scale(1)', borderWidth: '1px', opacity: '1' },
          '50%': { transform: 'scale(1.2)', borderWidth: '2px', opacity: '0.5' },
          '100%': { transform: 'scale(1.3)', borderWidth: '1px', opacity: '0' },
        },
        'spin-and-pulse': {
          '0%': { transform: 'rotate(0deg) scale(0.95)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        }
      },
      maxWidth: {
        '2xl': '40rem',
      },
      screens: {
        smH: { raw: '(max-height: 450px) and (min-width:667px)' },
        mdH: { raw: '(max-height: 870px) and (min-width:1279px)' },
        lgH: { raw: '(max-height: 1000px) and (min-width:1279px)' },
        smd: '640px',
        mld: '768px',
        onlyMd: { raw: '(min-width:768px) and (max-width:1023px)' },
      },
      padding: {
        '7.5': '1.875rem',
      },
      gap: {
        '7.5': '1.875rem',
      },
    },
  },
  plugins: [formsPlugin, headlessuiPlugin, require('@tailwindcss/typography'), require('tailwind-scrollbar')],
} satisfies Config;