import { extractTags } from "./stringUtils";

describe("extractTags", () => {
	test("returns the correct prefixTags and remainingTags", () => {
		const content = "#tag1 #tag2 I am great #tag3";
		const expectedPrefixTags = ["#tag1", "#tag2"];
		const expectedRemainingTags = ["#tag3"];

		const [prefixTags, remainingTags] = extractTags(content);

		expect(prefixTags).toEqual(expectedPrefixTags);
		expect(remainingTags).toEqual(expectedRemainingTags);
	});

	test("returns empty arrays when there are no tags", () => {
		const content = "This is a sample text without any tags";
		const expectedPrefixTags: string[] = [];
		const expectedRemainingTags: string[] = [];

		const [prefixTags, remainingTags] = extractTags(content);

		expect(prefixTags).toEqual(expectedPrefixTags);
		expect(remainingTags).toEqual(expectedRemainingTags);
	});

	test("returns empty arrays when the content is empty", () => {
		const content = "";
		const expectedPrefixTags: string[] = [];
		const expectedRemainingTags: string[] = [];

		const [prefixTags, remainingTags] = extractTags(content);

		expect(prefixTags).toEqual(expectedPrefixTags);
		expect(remainingTags).toEqual(expectedRemainingTags);
	});

	test("returns empty prefixTags and correct remainingTags when there are no prefix tags and one or more remaining tags", () => {
		const content = "Hello world #tag1 #tag2 #tag3";
		const expectedPrefixTags: string[] = [];
		const expectedRemainingTags = ["#tag1", "#tag2", "#tag3"];

		const [prefixTags, remainingTags] = extractTags(content);

		expect(prefixTags).toEqual(expectedPrefixTags);
		expect(remainingTags).toEqual(expectedRemainingTags);
	});
});
