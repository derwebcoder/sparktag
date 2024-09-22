/**
 * Extracts tags from the given content.
 *
 * @param content - The content to extract tags from.
 * @returns An array containing two arrays: prefixTags and remainingTags.
 *          - prefixTags: An array of tags that have a prefix.
 *          - remainingTags: An array of tags without a prefix.
 */
export const extractTags = (content: string): [string[], string[]] => {
	const token = content.split(" ");

	const prefixTags: string[] = [];
	while (token.length > 0 && token[0].startsWith("#")) {
		console.log("look", token[0]);
		prefixTags.push(token[0]);
		token.shift();
	}

	const remainingTags = token.filter((t) => t.startsWith("#"));

	return [prefixTags, remainingTags];
};
