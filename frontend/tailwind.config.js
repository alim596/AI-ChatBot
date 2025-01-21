module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // Add other paths as needed
  ],
  theme: {
    extend: {
      // Custom scrollbar colors (optional)
      colors: {
        scrollbarTrack: "#1f2937", // Dark gray
        scrollbarThumb: "#4b5563", // Lighter gray
        scrollbarThumbHover: "#6b7280", // Even lighter gray
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("@tailwindcss/typography")
  ],
};
