// file is only needed for storybook to work with tailwindcss
export default {
  plugins: {
    tailwindcss: {
      config: "tailwind.config.mjs",
    },
    autoprefixer: {},
  },
};
