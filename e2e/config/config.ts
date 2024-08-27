/**
 * Creates a URL by concatenating the given URL segments, building a valid url with
 *  - sparktag prefix
 *  - no double slashes
 *  - trailing slash
 *
 * @param urlSegments - The segments of the URL to concatenate.
 * @returns The concatenated URL.
 */
export const createUrl = (...urlSegments: string[]): string => {
	const cleanedSegments = urlSegments.map((segment) =>
		segment.replaceAll("/", ""),
	);
	if (cleanedSegments.length === 0) {
		return "/sparktag/";
	}

	if (cleanedSegments[0] === "sparktag") {
		cleanedSegments.splice(0, 1);
	}

	return `/sparktag/${urlSegments.map((s) => s.replaceAll("/", "")).join("/")}/`;
};
