
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#348080', // Teal from logo
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: '#B0E0E6', // Pale teal from logo background
					light: '#D3F9F9',
					dark: '#2A6666',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: '#e11d48', // Rose-600
					foreground: '#ffffff'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: '#F5F5DC', // Beige from logo background
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				strain: {
					indica: '#9333ea', // purple-600
					sativa: '#f59e0b', // amber-500
					hybrid: '#10b981', // emerald-500
				},
				// New color palette
				airForceBlue: {
					DEFAULT: '#4D8499',
					100: '#0f1a1f',
					200: '#1f343d',
					300: '#2e4f5c',
					400: '#3e697a',
					500: '#4d8499',
					600: '#6a9fb4',
					700: '#8fb7c7',
					800: '#b4cfd9',
					900: '#dae7ec'
				},
				cadetGray: {
					DEFAULT: '#81A0AE',
					100: '#172125',
					200: '#2f4149',
					300: '#46626e',
					400: '#5e8293',
					500: '#81a0ae',
					600: '#99b2be',
					700: '#b2c5ce',
					800: '#ccd9de',
					900: '#e5ecef'
				},
				ashGray: {
					DEFAULT: '#B8D3CB',
					100: '#1e302b',
					200: '#3c6156',
					300: '#5b9181',
					400: '#87b4a6',
					500: '#b8d3cb',
					600: '#c5dbd4',
					700: '#d4e4df',
					800: '#e2edea',
					900: '#f1f6f4'
				},
				oldLace: {
					DEFAULT: '#FAF2E6',
					100: '#503610',
					200: '#a06d20',
					300: '#da9f45',
					400: '#eac895',
					500: '#faf2e6',
					600: '#fbf4eb',
					700: '#fcf7f0',
					800: '#fdfaf5',
					900: '#fefcfa'
				},
				linen: {
					DEFAULT: '#FCF3E8',
					100: '#56340b',
					200: '#ac6816',
					300: '#e69a3d',
					400: '#f1c793',
					500: '#fcf3e8',
					600: '#fdf6ed',
					700: '#fdf8f1',
					800: '#fefaf6',
					900: '#fefdfa'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
			},
			boxShadow: {
				'card': '0 2px 8px rgba(0, 0, 0, 0.15)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
