import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	site: "https://derwebcoder.github.io",
	base: "sparktag",
	integrations: [
		tailwind({
			// disabling this because we have the src/styles/global.css file including the base styles,
			// which is also used and necessary for storybook to work with tailwindcss
			applyBaseStyles: false,
		}),
		react(),
	],
});
