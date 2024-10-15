import { extractTags, stringToHue } from "./stringUtils";

describe("extractTags", () => {
	test("returns the correct prefixTags and remainingTags", () => {
		const content = "#tag1 #tag2 I am great #tag3";
		const html =
			'"<p><span style="--tag-color: 135" data-type="mention" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="mention" class="tag" data-id="tag2">#tag2</span> I am great <span style="--tag-color: 145" data-type="mention" class="tag" data-id="tag3">#tag3</span></p>"';
		const expectedPrefixTags = ["tag1", "tag2"];
		const expectedPrefixTagsHtml = `<span style="--tag-color: 135" data-type="mention" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="mention" class="tag" data-id="tag2">#tag2</span> `;
		const expectedTags = ["tag1", "tag2", "tag3"];
		const expectStrippedPlainText = "I am great #tag3";
		const expectStrippedHtml =
			'"<p>I am great <span style="--tag-color: 145" data-type="mention" class="tag" data-id="tag3">#tag3</span></p>"';

		const {
			prefixTags,
			prefixTagsHtml,
			strippedHtml,
			strippedPlainText,
			tags,
		} = extractTags(content, html);

		expect(prefixTags).toEqual(expectedPrefixTags);
		expect(tags).toEqual(expectedTags);
		expect(prefixTagsHtml).toEqual(expectedPrefixTagsHtml);
		expect(strippedPlainText).toEqual(expectStrippedPlainText);
		expect(strippedHtml).toEqual(expectStrippedHtml);
	});

	test("returns empty arrays when there are no tags", () => {
		const content = "This is a sample text without any tags";
		const html = "<p>This is a sample text without any tags</p>";
		const expectedPrefixTags: string[] = [];
		const expectedPrefixTagsHtml = "";
		const expectedTags: string[] = [];
		const expectStrippedPlainText =
			"This is a sample text without any tags";
		const expectStrippedHtml =
			"<p>This is a sample text without any tags</p>";

		const {
			prefixTags,
			prefixTagsHtml,
			strippedHtml,
			strippedPlainText,
			tags,
		} = extractTags(content, html);

		expect(prefixTags).toEqual(expectedPrefixTags);
		expect(tags).toEqual(expectedTags);
		expect(prefixTagsHtml).toEqual(expectedPrefixTagsHtml);
		expect(strippedPlainText).toEqual(expectStrippedPlainText);
		expect(strippedHtml).toEqual(expectStrippedHtml);
	});

	test("returns empty arrays when the content is empty", () => {
		const content = "";
		const html = "";
		const expectedPrefixTags: string[] = [];
		const expectedPrefixTagsHtml = "";
		const expectedTags: string[] = [];
		const expectStrippedPlainText = "";
		const expectStrippedHtml = "";

		const {
			prefixTags,
			prefixTagsHtml,
			strippedHtml,
			strippedPlainText,
			tags,
		} = extractTags(content, html);

		expect(prefixTags).toEqual(expectedPrefixTags);
		expect(tags).toEqual(expectedTags);
		expect(prefixTagsHtml).toEqual(expectedPrefixTagsHtml);
		expect(strippedPlainText).toEqual(expectStrippedPlainText);
		expect(strippedHtml).toEqual(expectStrippedHtml);
	});

	test("returns empty prefixTags and correct remainingTags when there are no prefix tags and one or more remaining tags", () => {
		const content = "Hello world #tag1 #tag2 #tag3";
		const html =
			'<p>Hello world <span style="--tag-color: 135" data-type="mention" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="mention" class="tag" data-id="tag2">#tag2</span> <span style="--tag-color: 145" data-type="mention" class="tag" data-id="tag3">#tag3</span></p>';
		const expectedPrefixTags: string[] = [];
		const expectedPrefixTagsHtml = "";
		const expectedTags = ["tag1", "tag2", "tag3"];
		const expectStrippedPlainText = "Hello world #tag1 #tag2 #tag3";
		const expectStrippedHtml =
			'<p>Hello world <span style="--tag-color: 135" data-type="mention" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="mention" class="tag" data-id="tag2">#tag2</span> <span style="--tag-color: 145" data-type="mention" class="tag" data-id="tag3">#tag3</span></p>';

		const {
			prefixTags,
			prefixTagsHtml,
			strippedHtml,
			strippedPlainText,
			tags,
		} = extractTags(content, html);

		expect(prefixTags).toEqual(expectedPrefixTags);
		expect(tags).toEqual(expectedTags);
		expect(prefixTagsHtml).toEqual(expectedPrefixTagsHtml);
		expect(strippedPlainText).toEqual(expectStrippedPlainText);
		expect(strippedHtml).toEqual(expectStrippedHtml);
	});

	test("returns three prefix tags", () => {
		const content = "#tag1 #tag2 #tag3";
		const html =
			'<p><span style="--tag-color: 135" data-type="mention" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="mention" class="tag" data-id="tag2">#tag2</span> <span style="--tag-color: 145" data-type="mention" class="tag" data-id="tag3">#tag3</span></p>';
		const expectedPrefixTags: string[] = ["tag1", "tag2", "tag3"];
		const expectedPrefixTagsHtml =
			'<span style="--tag-color: 135" data-type="mention" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="mention" class="tag" data-id="tag2">#tag2</span> <span style="--tag-color: 145" data-type="mention" class="tag" data-id="tag3">#tag3</span> ';
		const expectedTags = ["tag1", "tag2", "tag3"];
		const expectStrippedPlainText = "";
		const expectStrippedHtml =
			'<p><span style="--tag-color: 135" data-type="mention" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="mention" class="tag" data-id="tag2">#tag2</span> <span style="--tag-color: 145" data-type="mention" class="tag" data-id="tag3">#tag3</span></p>';

		const {
			prefixTags,
			prefixTagsHtml,
			strippedHtml,
			strippedPlainText,
			tags,
		} = extractTags(content, html);

		expect(prefixTags).toEqual(expectedPrefixTags);
		expect(tags).toEqual(expectedTags);
		expect(prefixTagsHtml).toEqual(expectedPrefixTagsHtml);
		expect(strippedPlainText).toEqual(expectStrippedPlainText);
		expect(strippedHtml).toEqual(expectStrippedHtml);
	});
});

describe("stringToHue", () => {
	test("Returns a deterministic value", () => {
		const input = "Heart to heart";

		const hue = stringToHue(input);

		expect(hue).toBe(122);
	});
});
