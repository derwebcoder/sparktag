import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Smoke Tests", () => {
	test("has title", async ({ page }) => {
		await page.goto("/sparktag/");

		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Sparktag/);
	});

	test("ensure accessibility standards", async ({ page }, testInfo) => {
		await page.goto("/sparktag/");

		const accessibilityScanResults = await new AxeBuilder({
			page,
		}).analyze();

		await testInfo.attach("accessibility-scan-results", {
			body: JSON.stringify(accessibilityScanResults, null, 2),
			contentType: "application/json",
		});

		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
