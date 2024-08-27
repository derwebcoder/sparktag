import { test, expect } from "../config/setup";

test.describe("Auth", () => {
	test("can login", async ({ authPage }) => {
		if (!process.env.NOT_SO_SECRET_SECRET) {
			test.info().annotations.push({
				type: "reason for failing",
				description: "Secret per environment variable not provided",
			});
			// exit early
			expect(process.env.NOT_SO_SECRET_SECRET).not.toBe(undefined);
		}

		await authPage.enterPassword(process.env.NOT_SO_SECRET_SECRET ?? "");
		await authPage.submit();
		// Expect a title "to contain" a substring.
		await expect(await authPage.hasLocalStorageSecret()).toBe(true);
	});

	test("shows error for wrong secret", async ({ authPage }) => {
		await authPage.enterPassword("wrong-secret");
		await authPage.submit();
		// Expect a title "to contain" a substring.
		await expect(await authPage.getErrorMessage()).toBe(
			"😢 Sadly that is not correct.",
		);
	});
});
