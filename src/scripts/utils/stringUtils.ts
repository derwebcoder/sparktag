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
