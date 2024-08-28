import { test as base } from "@playwright/test";
import { AuthPage } from "../pages/AuthPage";
import { MainPage } from "../pages/MainPage";

// Declare the types of your fixtures.
type MyFixtures = {
	authPage: AuthPage;
	mainPage: MainPage;
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
	mainPage: async ({ page }, use) => {
		// Set up the fixture.
		const mainPage = new MainPage(page);
		await mainPage.goto();

		// Use the fixture value in the test.
		await use(mainPage);
	},
});
export { expect } from "@playwright/test";
