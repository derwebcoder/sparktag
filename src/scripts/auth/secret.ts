import { config } from "../../config/config";

export const hash = async (text: string) => {
	const msgUint8 = new TextEncoder().encode(text); // encode as (utf-8) Uint8Array
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join(""); // convert bytes to hex string
	return hashHex;
};

export const authenticate = async (text: string) => {
	const hashHex = await hash(text);

	if (hashHex !== config.getNotSoSecretSecret()) {
		throw new Error("Invalid secret");
	}

	localStorage.setItem("notSoSecretSecret", text);

	return true;
};

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
