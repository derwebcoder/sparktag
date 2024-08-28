import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../config/setup";

test.describe("Main Tests", () => {
	test("can add spark @smoke", async ({ mainPage }) => {
		await mainPage.fillNote("Hello, world!");
		await mainPage.submit();

		// Expect a title "to contain" a substring.
		await expect((await mainPage.getSparks()).length).toBe(1);
		await expect((await mainPage.getSparks())[0]).toHaveText(
			"Hello, world!",
		);
	});

	test("ensure accessibility standards", async ({ mainPage }, testInfo) => {
		const accessibilityScanResults = await new AxeBuilder({
			page: mainPage.page,
		}).analyze();

		await testInfo.attach("accessibility-scan-results", {
			body: JSON.stringify(accessibilityScanResults, null, 2),
			contentType: "application/json",
		});

		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
