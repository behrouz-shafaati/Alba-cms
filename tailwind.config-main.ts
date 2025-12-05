import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  safelist: [
    ,
    {
      pattern: /col-span-(1[0-2]|[1-9])/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    // {
    //   pattern:
    //     /(bg|text|border)-(gray|neutral|zinc|stone|slate|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
    //   variants: ['hover'], // hover کلاس‌ها
    // },
    // {
    //   pattern:
    //     /(bg|text|dark:text)-(gray|neutral|zinc|stone|slate|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
    //   variants: ['dark', 'hover'], // اینجا میگی همه این کلاس‌ها رو با dark هم بساز
    // },
    // {
    //   pattern: /(bg|text|border)-(black|white|transparent)/,
    //   variants: ['dark', 'dark:hover'],
    // },
    // تمام breakpointها برای displayهای مهم
    'sm:!block',
    'md:!block',
    'lg:!block',
    'xl:!block',
    '2xl:!block',
    'sm:!flex',
    'md:!flex',
    'lg:!flex',
    'xl:!flex',
    '2xl:!flex',
    'sm:!grid',
    'md:!grid',
    'lg:!grid',
    'xl:!grid',
    '2xl:!grid',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      container: {
        screens: {
          '2xl': '1400px',
        },
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // corePlugins: {
  //   aspectRatio: false,
  // },
  plugins: [
    require('tailwindcss-animate'),
    // require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config

export default config
