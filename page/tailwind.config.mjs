/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  // content: [
  //   './pages/**/*.{ts,tsx}',
  //   './components/**/*.{ts,tsx}',
  //   './app/**/*.{ts,tsx}',
  //   './src/**/*.{ts,tsx}',
  // ],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
				sans: ['"Inter var", sans-serif',]
			},
      colors: {
        'p-background': '#040822',
				'p-secondary-background': '#181a44',
				'p-accent-background': '#0f113e',
				'p-primary': '#D60B18',
				'p-secondary': '#F3672B',
				'p-accent': 'white',
				'p-primary-text': '#F0F0F0',
				'p-secondary-text': '#D0D0D0',
				'p-border': '#3c4d6f',

				'p-purple': '#711C68',
				'p-purple-light': '#a7cbff',
				'p-blue': '#444cf5',
        
        // border: "hsl(var(--border))",
        border: "#3c4d6f",
        input: "#3c4d6f",
        ring: "hsl(var(--ring))",
        // background: "hsl(var(--background))",
        background: "#0f113e",
        foreground: "#0f113e",
        primary: {
          DEFAULT: "#3c4d6f",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          // DEFAULT: "hsl(var(--popover))",
          DEFAULT: "#181a44",
          // foreground: "hsl(var(--popover-foreground))",
          foreground: "#D0D0D0",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        'infinite-scroll': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-100%)' },
				}
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'infinite-scroll': 'infinite-scroll 20s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/line-clamp")],
}