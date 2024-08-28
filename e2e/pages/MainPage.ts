import type { Locator, Page } from "@playwright/test";
import { authenticate, createUrl } from "../config/utils";

export class MainPage {
	private readonly noteInput: Locator;
	private readonly submitButton: Locator;
	private readonly sparkList: Locator;

	constructor(public readonly page: Page) {
		this.noteInput = page.getByLabel("New spark");
		this.submitButton = page.getByRole("button", { name: "Add" });
		this.sparkList = page.getByRole("list", { name: "Sparks" });
	}

	async goto() {
		const url = createUrl();
		await this.page.goto(url);
		await authenticate(this.page);
	}

	async fillNote(password: string) {
		await this.noteInput.fill(password);
	}

	async submit() {
		await this.submitButton.click();
	}

	async getSparks() {
		return await this.sparkList.all();
	}
}
