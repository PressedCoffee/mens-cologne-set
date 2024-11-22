/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: "#ffd700",
          400: "#ffcc00",
          500: "#ffb300",
        },
      },
      typography: {
        invert: {
          css: {
            "--tw-prose-body": "var(--tw-prose-invert-body)",
            "--tw-prose-headings": "var(--tw-prose-invert-headings)",
            "--tw-prose-links": "var(--tw-prose-invert-links)",
            "--tw-prose-lists": "var(--tw-prose-invert-lists)",
            "--tw-prose-counters": "var(--tw-prose-invert-counters)",
            "--tw-prose-bullets": "var(--tw-prose-invert-bullets)",
            color: "#e5e7eb", // gray-200
            '[class~="lead"]': {
              color: "#f3f4f6", // gray-100
            },
            strong: {
              color: "#ffffff", // white
            },
            "ol > li::marker": {
              color: "#d1d5db", // gray-300
            },
            "ul > li::marker": {
              color: "#d1d5db", // gray-300
            },
            hr: {
              borderColor: "#374151", // gray-700
            },
            blockquote: {
              color: "#f3f4f6", // gray-100
              borderLeftColor: "#374151", // gray-700
            },
            h1: {
              color: "#ffffff", // white
            },
            h2: {
              color: "#ffffff", // white
            },
            h3: {
              color: "#ffffff", // white
            },
            h4: {
              color: "#ffffff", // white
            },
            "figure figcaption": {
              color: "#9ca3af", // gray-400
            },
            code: {
              color: "#ffffff", // white
            },
            "a code": {
              color: "#ffffff", // white
            },
            pre: {
              color: "#e5e7eb", // gray-200
              backgroundColor: "#1f2937", // gray-800
            },
            thead: {
              color: "#ffffff", // white
              borderBottomColor: "#4b5563", // gray-600
            },
            "tbody tr": {
              borderBottomColor: "#374151", // gray-700
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
