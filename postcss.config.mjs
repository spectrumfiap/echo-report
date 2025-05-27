// postcss.config.js ou postcss.config.mjs
const config = {
  plugins: [
    "@tailwindcss/postcss", // Para Tailwind CSS v4 (ou o nome do plugin oficial para v4)
    "autoprefixer",
  ],
};

export default config;