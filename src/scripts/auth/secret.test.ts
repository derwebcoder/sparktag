import { config } from "../../config/config";
import * as secretLib from "./secret";

describe("Secret", () => {
	beforeEach(() => {
		// Mocking localStorage
		Object.defineProperty(window, "localStorage", {
			value: {
				getItem: vi.fn(),
				setItem: vi.fn(),
			},
			writable: true,
		});
	});

	afterEach(() => {
		// Resetting mocks
		vi.clearAllMocks();
	});

	describe("hash", () => {
		test("returns the correct hash", async () => {
			const text = "hello";
			const expectedHash = "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";

			const hashHex = await secretLib.hash(text);

			expect(hashHex).toBe(expectedHash);
		});
	});

	describe("authenticate", () => {
		test("authenticates the text with the correct secret", async () => {
			const password = "hello";
			const secret =
				"2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";

			config.getNotSoSecretSecret = vi.fn().mockReturnValue(secret);

			await secretLib.authenticate(password);

			expect(localStorage.setItem).toHaveBeenCalledWith(
				"notSoSecretSecret",
				password,
			);
		});

		test("throws an error for invalid secret", async () => {
			const text = "hello";
			const secret = "invalidSecret";

			config.getNotSoSecretSecret = vi.fn().mockReturnValue(secret);

			await expect(secretLib.authenticate(text)).rejects.toThrow("Invalid secret");
		});
	});

	describe("isAuthenticated", () => {
		test("returns true for authenticated user", async () => {
			const storedSecret = "hello";
			const secret =
				"2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";

			config.getNotSoSecretSecret = vi.fn().mockReturnValue(secret);
            vi.spyOn(window.localStorage, "getItem").mockReturnValue(
                storedSecret,
            );
            // vi.spyOn(secretLib, "hash").mockResolvedValue(secret);

			const result = await secretLib.isAuthenticated();

			expect(result).toBe(true);
		});

		test("returns false for unauthenticated user", async () => {
			const storedSecret = "hello";
			const secret =
				"anythingThatsWrong";

			config.getNotSoSecretSecret = vi.fn().mockReturnValue(secret);
			vi.spyOn(window.localStorage, "getItem").mockReturnValue(
                storedSecret,
            );

			const result = await secretLib.isAuthenticated();

			expect(result).toBe(false);
		});
	});
});
