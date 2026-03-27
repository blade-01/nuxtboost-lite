/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  safelist: [
    "z-40",
    "fixed",
    "inset-0",
    "overflow-y-auto",
    "flex",
    "items-end",
    "items-center",
    "justify-center",
    "sm:items-start",
    "sm:items-end",
    "sm:justify-end",
    "px-4",
    "py-6",
    "p-3",
    "sm:p-6",
    "pointer-events-none",
    "pointer-events-auto",
    "w-full",
    "max-w-sm",
    "max-w-3xl",
    "rounded-lg",
    "rounded",
    "shadow-lg",
    "shadow-xl",
    "ring-1",
    "ring-black",
    "ring-opacity-5",
    "overflow-hidden",
    "bg-white",
    "bg-black",
    "bg-red-600",
    "bg-blue-100",
    "bg-red-100",
    "bg-yellow-100",
    "bg-green-100",
    "text-white",
    "text-gray-900",
    "text-gray-500",
    "text-gray-400",
    "border",
    "border-transparent",
    "opacity-75",
    "transition",
    "transition-opacity",
    "transform",
    "inline-flex",
    "font-medium",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "focus:ring-indigo-500",
    "focus:ring-red-500",
    "hover:bg-red-500",
    "hover:bg-gray-800",
    "sm:max-w-lg",
    "sm:w-full",
    "sm:block",
    "sm:flex",
    "sm:flex-row-reverse",
    "sm:my-8",
    "sm:align-middle",
    "sm:text-left",
    "sm:ml-4",
    "sm:mt-0"
  ],
  theme: {
    extend: {
      colors: {
        btn: {
          primary: "#0f172a",
          secondary: "#ffffff"
        },
        text: {
          primary: "#0f172a",
          secondary: "#475569",
          icon: "#64748b",
          file: "#94a3b8"
        },
        link: {
          primary: "#f1f5f9",
          secondary: "#e2e8f0"
        },
        label: {
          primary: "#334155",
          secondary: "#ffffff"
        },
        placeholder: {
          primary: "#94a3b8",
          secondary: "#cbd5e1"
        },
        disabled: {
          primary: "#e2e8f0",
          secondary: "#cbd5e1"
        },
        focus: {
          primary: "#94a3b8",
          secondary: "#cbd5e1"
        },
        border: {
          primary: "#d7dee7",
          secondary: "#cbd5e1"
        },
        bg: {
          primary: "#f5f7fb",
          secondary: "#ffffff"
        },
        hover: {
          primary: "#e2e8f0",
          secondary: "#cbd5e1"
        },
        checkbox: {
          primary: "#cbd5e1",
          secondary: "#94a3b8"
        },
        accent: {
          primary: "#0f172a",
          secondary: "#475569"
        },
        sidebar: {
          primary: "#ffffff",
          secondary: "#f8fafc"
        },
        input: {
          primary: "#ffffff",
          secondary: "#f8fafc"
        },
        scroll: {
          track: "#eef2f7",
          trackSec: "#e2e8f0",
          thumb: "#cbd5e1",
          thumbSec: "#94a3b8"
        },
        filter: {
          primary: "#f8fafc",
          secondary: "#f1f5f9"
        },
        selected: {
          primary: "#e8eef7",
          secondary: "#dbe7f5",
          hover: "#f1f5f9",
          hoverSec: "#e2e8f0"
        }
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        urbanist: ["Urbanist", "sans-serif"]
      },
      fontSize: {
        nl: ["56px", "64px"]
      },
      screens: {
        "2xs": "200px",
        "1xs": "350px",
        "1xl": "1400px",
        "3xl": "2000px"
      }
    }
  },
  content: [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `composables/**/*.{js,ts}`,
    `plugins/**/*.{js,ts}`,
    `node_modules/tailvue/dist/tailvue.es.js`,
    `App.{js,ts,vue}`,
    `app.{js,ts,vue}`
  ]
}
