import { config } from "../../config/config";

/**
 * Computes the SHA-256 hash of the given text.
 *
 * @param text - The text to be hashed.
 * @returns The hexadecimal representation of the hash.
 */
export const hash = async (text: string) => {
	const msgUint8 = new TextEncoder().encode(text); // encode as (utf-8) Uint8Array
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join(""); // convert bytes to hex string
	return hashHex;
};

/**
 * Authenticates the provided password by comparing its hash with the configured secret.
 *
 * @param password - The password to authenticate.
 * @returns A promise that resolves to `true` if the authentication is successful.
 * @throws An error with the message "Invalid secret" if the authentication fails.
 */
export const authenticate = async (password: string) => {
	const hashHex = await hash(password);

	if (hashHex !== config.getNotSoSecretSecret()) {
		throw new Error("Invalid secret");
	}

	localStorage.setItem("notSoSecretSecret", password);

	return true;
};

/**
 * Checks if the user is authenticated.
 * @returns A promise that resolves to true if the user is authenticated, otherwise false.
 */
export const isAuthenticated = async () => {
	const storedSecret = localStorage.getItem("notSoSecretSecret");

	if (
		!storedSecret ||
		(await hash(storedSecret)) !== config.getNotSoSecretSecret()
	) {
		return false;
	}

	return true;
};
