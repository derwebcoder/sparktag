import type { Locator, Page } from "@playwright/test";
import { createUrl } from "../config/config";

export class AuthPage {
	private readonly passwordInput: Locator;
	private readonly submitButton: Locator;
	constructor(public readonly page: Page) {
		this.passwordInput = page.locator("[type=password]");
		this.submitButton = page.locator("[type=submit]");
	}

	async goto() {
		const url = createUrl("auth");
		await this.page.goto(url);
	}

	async enterPassword(password: string) {
		await this.passwordInput.fill(password);
	}

	async submit() {
		await this.submitButton.click();
	}

	async getErrorMessage() {
		return await this.page.getByRole("alert").innerText();
	}

	async clearLocalStorage() {
		await this.page.evaluate(() => localStorage.clear());
	}

	async hasLocalStorageSecret() {
		return await this.page.evaluate(
			() => localStorage.getItem("notSoSecretSecret") !== null,
		);
	}
}
