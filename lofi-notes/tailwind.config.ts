// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // soft lofi purples
        grape: {
          50:  "#faf7ff",
          100: "#f4eeff",
          200: "#e7dcff",
          300: "#d1bdff",
          400: "#b497ff",
          500: "#9a7cf0",
          600: "#7a60cf",
          700: "#614ca9",
          800: "#4e3d88",
          900: "#3f316f",
        },
      },
      boxShadow: {
        lofiglow: "0 10px 30px rgba(154,124,240,0.25)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
