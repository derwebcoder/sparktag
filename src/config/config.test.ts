import { config } from "../config/config";

describe("Config", () => {
	test("returns the not-so-secret secret", () => {
		const secret = config.getNotSoSecretSecret();
		expect(secret).toBe(
			"d4461bfeabd1ee6b5679a671129efc92a170992994e63f64d0e6dd02a18f67aa",
		);
	});
});
