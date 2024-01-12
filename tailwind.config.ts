import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        openmenu:  'openmenu 200ms ease-in',
        closemenu:  'closemenu 200ms ease-in',
    },
    keyframes: {
        openmenu: {
            '0%': {left:  '-224px'},
            '100%': {left:  '0px'}
        },
        closemenu: {
            '0%': {left:  '0px'},
            '100%': {left:  '-224px'}
        },
    },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
