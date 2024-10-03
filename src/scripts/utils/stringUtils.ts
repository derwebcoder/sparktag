/**
 * Extracts tags from the given content.
 *
 * @param content - The content to extract tags from.
 * @returns An array containing two arrays: prefixTags and remainingTags.
 *          - prefixTags: An array of tags that have a prefix.
 *          - remainingTags: An array of tags without a prefix.
 * 			- strippedContent: The content without the prefixTags
 */
export const extractTags = (content: string): [string[], string[], string] => {
	const token = content.split(" ");

	const prefixTags: string[] = [];
	let prefixTagsLength = 0;
	while (token.length > 0 && token[0].startsWith("#")) {
		prefixTags.push(token[0]);
		prefixTagsLength += token[0].length;
		token.shift();
	}

	const remainingTags = token.filter((t) => t.startsWith("#"));

	const strippedContent = content.slice(prefixTagsLength + prefixTags.length);

	return [prefixTags, remainingTags, strippedContent];
};

/**
 * Returns a deterministic number between 0-360 for a given string.
 *
 * @param str The input string
 * @returns a number between 0 and 360
 */
export const stringToHue = (str: string) => {
	let numberHash = 0;

	for (let i = 0; i < str.length; i++) {
		numberHash += (i + 1) * str.charCodeAt(i);
	}

	return numberHash % 360;
};
