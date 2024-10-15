/**
 * Extracts tags from the given content.
 *
 * @param plainText - The content to extract tags from as plain text.
 * @param html - The content to extract tags from as html.
 * @returns An object containing the following attributes:
 *          - tags: An array of all tags.
 *          - prefixTags: An array of tags that have a prefix.
 * 			- prefixTagsHtml: The HTML representation of the prefixTags
 * 			- strippedPlainText: The plain text content without the prefixTags
 * 			- strippedHtml: The html content without the prefixTags
 */
export const extractTags = (plainText: string, html: string) => {
	const renderedHtml = document.createElement("div");
	renderedHtml.innerHTML = html;

	const tagNodes = Array.from(
		renderedHtml.querySelectorAll<HTMLSpanElement>(
			".tag[data-type=mention]",
		),
	);

	const tags: string[] = [];
	const prefixTags: string[] = [];
	let prefixTagsHtml = "";
	let isCollectPrefixTags = true;

	// a function to check if a node is possibly still a prefix tag node
	const hasPreviousTagSiblingOrIsFirst = (node: Node) => {
		const prevNode = node.previousSibling;
		// if it does not have a previous node, it's the first one, so it's a prefix tag
		if (!prevNode) {
			return true;
		}

		// if it prev node is an element and it has `data-type="mention"` we return true
		if (prevNode.nodeType === 1) {
			const prevElement = prevNode as HTMLElement;
			if (prevElement.dataset.type === "mention") {
				return true;
			}

			// if it is an element but not a tag, we return false
			return false;
		}

		// if it is a TEXT_NODE (3) and _not_ empty, it is not a prefix tag
		if (prevNode.nodeType === 3 && prevNode.textContent?.trim() !== "") {
			return false;
		}

		return hasPreviousTagSiblingOrIsFirst(prevNode);
	};

	for (const tagNode of tagNodes) {
		const tagName = toLowerCase(tagNode.dataset.id);

		if (!tagName) {
			continue;
		}

		// if it returns false it cannot be a prefix tag anymore,
		// so we stop collecting prefix tags
		if (isCollectPrefixTags && !hasPreviousTagSiblingOrIsFirst(tagNode)) {
			isCollectPrefixTags = false;
		}

		tags.push(tagName);
		if (isCollectPrefixTags) {
			prefixTags.push(tagName);
			prefixTagsHtml += `${tagNode.outerHTML} `;
		}
	}

	const prefixTagsString = `${prefixTags.map((t) => `#${t}`).join(" ")} `;
	const strippedPlainText =
		prefixTagsString.length > 1
			? plainText.split(
					`${prefixTags.map((t) => `#${t}`).join(" ")} `,
				)[1] ?? ""
			: plainText;

	const strippedHtml =
		prefixTagsHtml.length > 1 ? html.split(prefixTagsHtml).join("") : html;

	return {
		tags,
		prefixTags,
		strippedPlainText,
		strippedHtml,
		prefixTagsHtml,
	};
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

/**
 * Returns a string without a leading '#' char.
 * For example:
 *  - #test => test
 *  - grape => grape
 * @param tag
 * @returns string without leading '#'
 */
export const removeHash = (tag: string) => {
	if (tag.startsWith("#")) {
		return tag.slice(1);
	}
	return tag;
};

export function toLowerCase(s: string): string;
export function toLowerCase(s: undefined): undefined;
export function toLowerCase(s: string | undefined): string | undefined;
export function toLowerCase(s: string | undefined) {
	return s?.toLowerCase();
}
