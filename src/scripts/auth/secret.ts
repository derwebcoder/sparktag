// yes, it's fine this is in here, this is just a very basic "authentication" system
// to keep the usage limited to few people right now.
const notSoSecretSecret =
	"d4461bfeabd1ee6b5679a671129efc92a170992994e63f64d0e6dd02a18f67aa";

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

	if (hashHex !== notSoSecretSecret) {
		throw new Error("Invalid secret");
	}

	localStorage.setItem("notSoSecretSecret", text);

	return true;
};

export const isAuthenticated = async () => {
	const storedSecret = localStorage.getItem("notSoSecretSecret");

	if (!storedSecret || (await hash(storedSecret)) !== notSoSecretSecret) {
		return false;
	}

	return true;
};
