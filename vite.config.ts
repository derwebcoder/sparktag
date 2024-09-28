/// <reference types="vitest/config" />

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	test: {
		include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
		globals: true,
		environment: "happy-dom",
		setupFiles: ["./vitest.setup.ts"],
	},
	plugins: [tsconfigPaths()],
});
