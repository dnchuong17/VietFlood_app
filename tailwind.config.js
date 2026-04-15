/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src-rn/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        // Primary
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
          light: '#dbeafe',
        },

        // Semantic
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
        },
        danger: {
          DEFAULT: '#dc2626',
          light: '#fee2e2',
        },
        info: {
          DEFAULT: '#06b6d4',
          light: '#cffafe',
        },

        // Neutral
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },

      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
      },

      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },

      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['28px', '36px'],
        '4xl': ['32px', '40px'],
      },

      shadow: {
        // iOS-style shadows (elevation)
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 8px 0 rgba(0, 0, 0, 0.15)',
        lg: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
        xl: '0 12px 24px 0 rgba(0, 0, 0, 0.25)',
      },

      // Screen sizes for responsive design
      screens: {
        xs: { raw: '(max-width: 374px)' },
        sm: { raw: '(min-width: 375px)' },
        md: { raw: '(min-width: 768px)' },
        lg: { raw: '(min-width: 1024px)' },
        landscape: { raw: '(orientation: landscape)' },
      },
    },
  },

  plugins: [
    // React Native supports only a subset of Tailwind
    // Restrict utilities to those that work with React Native
    ({ matchUtilities, theme }) => {
      matchUtilities(
        {
          // Custom utilities for React Native-specific needs
        },
        { values: theme('spacing') }
      );
    },
  ],

  // NativeWind-specific configuration
  corePlugins: {
    // Disable utilities that don't work well with React Native
    preflight: false, // Don't reset styles (React Native doesn't use CSS)
    float: false,
    clear: false,
    display: false,
    margin: false,
    padding: false,
    width: false,
    height: false,
    minHeight: false,
    maxHeight: false,
  },
};
