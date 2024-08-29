import type { Locator, Page } from "@playwright/test";
import { createUrl } from "../config/utils";

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
		await this.page.waitForFunction(() => {
			localStorage.clear();
			return true;
		});
	}

	async hasLocalStorageSecret() {
		return await this.page.evaluate(() => {
			return localStorage.getItem("notSoSecretSecret") !== null;
		});
	}
}
