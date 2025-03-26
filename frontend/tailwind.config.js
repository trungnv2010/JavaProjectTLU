/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        blur: '0px 2px 160px rgba(102, 37, 0, 0.12), 0px 2px 24px -32px rgba(102, 37, 0, 0.12)',
        card: '0px 12px 24px -4px hsla(210, 13%, 62%, 0.12), 0px 0px 2px 0px hsla(210, 13%, 62%, 0.2)',
        drop: '0px 4px 24px 0px hsla(28, 94%, 41%, 0.3)',
        expand: '2px 0px 28.3px 0px #DFDFDF4D'
      },
      // Enable backdrop-filter utilities
      backdropBlur: {
        fBlur: 'blur(160px)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))'
        },
        error: {
          DEFAULT: '#FF3B30',
          foreground: '#FF0000'
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
