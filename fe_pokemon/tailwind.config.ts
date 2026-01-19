import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          red: "#DC0A2D",
          "red-dark": "#C00927",
        },
        type: {
          normal: "#A8A77A",
          fire: "#EE8130",
          water: "#6390F0",
          electric: "#F7D02C",
          grass: "#7AC74C",
          ice: "#96D9D6",
          fighting: "#C22E28",
          poison: "#A33EA1",
          ground: "#E2BF65",
          flying: "#A98FF3",
          psychic: "#F95587",
          bug: "#A6B91A",
          rock: "#B6A136",
          ghost: "#735797",
          dragon: "#6F35FC",
          dark: "#705746",
          steel: "#B7B7CE",
          fairy: "#D685AD",
        },
        grayscale: {
          dark: "#212121",
          medium: "#666666",
          light: "#E0E0E0",
          background: "#EFEFEF",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      fontSize: {
        headline: ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "subtitle-1": ["14px", { lineHeight: "16px", fontWeight: "700" }],
        "subtitle-2": ["12px", { lineHeight: "16px", fontWeight: "700" }],
        "subtitle-3": ["10px", { lineHeight: "16px", fontWeight: "700" }],
        "body-1": ["14px", { lineHeight: "16px", fontWeight: "400" }],
        "body-2": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "body-3": ["10px", { lineHeight: "16px", fontWeight: "400" }],
        caption: ["8px", { lineHeight: "12px", fontWeight: "400" }],
      },
      boxShadow: {
        "drop-shadow-2dp": "0px 1px 3px 1px rgba(0, 0, 0, 0.2)",
        "drop-shadow-6dp": "0px 3px 12px 3px rgba(0, 0, 0, 0.2)",
        inner: "inset 0px 1px 3px 1px rgba(0, 0, 0, 0.25)",
      },
      borderRadius: {
        pokemon: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
