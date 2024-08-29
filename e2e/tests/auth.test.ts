import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../config/setup";

test.describe("Auth", () => {
	test("can login @smoke", async ({ authPage }) => {
		if (!process.env.NOT_SO_SECRET_SECRET) {
			test.info().annotations.push({
				type: "reason for failing",
				description: "Secret per environment variable not provided",
			});
			// exit early
			expect(process.env.NOT_SO_SECRET_SECRET).not.toBe(undefined);
		}

		// needed because astro hydration is sometimes not fast enough
		// and then the form submits with the usual GET behavior
		// This timeout should allow the hydration to finish
		await authPage.page.waitForTimeout(1000);

		await authPage.enterPassword(process.env.NOT_SO_SECRET_SECRET ?? "");
		await authPage.submit();

		await expect(await authPage.hasLocalStorageSecret()).toBe(true);
	});

	test("shows error for wrong secret", async ({ authPage }) => {
		await authPage.enterPassword("wrong-secret");
		await authPage.submit();

		// needed because astro hydration is sometimes not fast enough
		// and then the form submits with the usual GET behavior
		// This timeout should allow the hydration to finish
		await authPage.page.waitForTimeout(1000);

		await expect(await authPage.getErrorMessage()).toBe(
			"😢 Sadly that is not correct.",
		);
	});

	test("ensure accessibility standards", async ({ authPage }, testInfo) => {
		const accessibilityScanResults = await new AxeBuilder({
			page: authPage.page,
		}).analyze();

		await testInfo.attach("accessibility-scan-results", {
			body: JSON.stringify(accessibilityScanResults, null, 2),
			contentType: "application/json",
		});

		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
