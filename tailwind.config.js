/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... (your existing config: content, darkMode, theme, etc.)
  theme: {
    extend: {
      // ... (your existing extend values)
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // --- ADD THESE FOR THE POPOVER ---
        "content-show": {
          from: { opacity: "0", transform: "scale(0.96) translateY(-10px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "content-hide": {
          from: { opacity: "1", transform: "scale(1) translateY(0)" },
          to: { opacity: "0", transform: "scale(0.96) translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // --- AND ADD THESE ---
        "content-show": "content-show 0.15s ease-out",
        "content-hide": "content-hide 0.15s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate") // <-- Make sure you have this plugin
  ],
}