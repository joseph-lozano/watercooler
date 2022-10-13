/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const corporateTheme = require("daisyui/src/colors/themes")[
  "[data-theme=corporate]"
];
const businessTheme = require("daisyui/src/colors/themes")[
  "[data-theme=business]"
];
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        corporate: {
          ...corporateTheme,
          primary: colors.sky["600"],
          secondary: colors.emerald["600"],
          accent: colors.indigo["500"],
          "base-100": colors.gray["50"],
          "base-200": colors.gray["200"],
          "base-300": colors.gray["400"],
          "base-content": colors.gray["800"],
        },
        business: {
          ...businessTheme,
          "base-content": colors.slate["200"],
          primary: colors.sky["500"],
          secondary: colors.emerald["400"],
          accent: colors.indigo["400"],
        },
      },
    ],
    darkTheme: "business",
  },
};
