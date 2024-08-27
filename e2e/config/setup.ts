import { test as base } from "@playwright/test";
import { AuthPage } from "../pages/AuthPage";

// Declare the types of your fixtures.
type MyFixtures = {
	authPage: AuthPage;
};

export const test = base.extend<MyFixtures>({
	authPage: async ({ page }, use) => {
		// Set up the fixture.
		const authPage = new AuthPage(page);
		await authPage.goto();
		await authPage.clearLocalStorage();

		// Use the fixture value in the test.
		await use(authPage);
	},
});
export { expect } from "@playwright/test";
