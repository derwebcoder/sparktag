import { extractTags, parseSpark, stringToHue } from "./stringUtils";

describe("extractTags", () => {
	test("extracts one tag from only tag input", () => {
		const html =
			'<p><span style="--tag-color: 135" data-type="tags" class="tag" data-id="world">#world</span></p>';
		const expectedTags: string[] = ["world"];

		const tags = extractTags(html);

		expect(tags).toEqual(expectedTags);
	});

	test("extracts no tag from input without any tags", () => {
		const html =
			"<p>This is a string <span>that has no tags</span> at all</p>";
		const expectedTags: string[] = [];

		const tags = extractTags(html);

		expect(tags).toEqual(expectedTags);
	});

	test("extracts multiple tags from only tag input", () => {
		const html =
			'<p><span style="--tag-color: 135" data-type="tags" class="tag" data-id="phone">#phone</span> <span style="--tag-color: 1" data-type="tags" class="tag" data-id="number">#thiswillbeignoredandonlydataidwillbeparsed</span></p>';
		const expectedTags: string[] = ["phone", "number"];

		const tags = extractTags(html);

		expect(tags).toEqual(expectedTags);
	});

	test("extracts multiple tags from mixed input", () => {
		const html =
			'<p>Fun <span style="--tag-color: 0" data-type="tags" class="tag" data-id="scissor">#scissor</span> #utilitiesNotARealTag <span style="--tag-color: 22" data-type="tags" class="tag" data-id="music">#music</span> life <span style="--tag-color: 444" data-type="tags" class="tag" data-id="attention">#attention</span> </p>';
		const expectedTags: string[] = ["scissor", "music", "attention"];

		const tags = extractTags(html);

		expect(tags).toEqual(expectedTags);
	});

	test("returns only lowercase tags", () => {
		const html =
			'<p><span style="--tag-color: 135" data-type="tags" class="tag" data-id="FreedomEnergy">#FreedomEnergy</span></p>';
		const expectedTags: string[] = ["freedomenergy"];

		const tags = extractTags(html);

		expect(tags).toEqual(expectedTags);
	});
});

describe("parseSpark", () => {
	test("returns the correct prefixTags and remainingTags", () => {
		const content = "#tag1 #tag2 I am great #tag3";
		const html =
			'"<p><span style="--tag-color: 135" data-type="tags" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="tags" class="tag" data-id="tag2">#tag2</span> I am great <span style="--tag-color: 145" data-type="tags" class="tag" data-id="tag3">#tag3</span></p>"';
		const expectedPrefixTags = ["tag1", "tag2"];
		const expectedPrefixTagsHtml = `<span style="--tag-color: 135" data-type="tags" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="tags" class="tag" data-id="tag2">#tag2</span> `;
		const expectedTags = ["tag1", "tag2", "tag3"];
		const expectStrippedPlainText = "I am great #tag3";
		const expectStrippedHtml =
			'"<p>I am great <span style="--tag-color: 145" data-type="tags" class="tag" data-id="tag3">#tag3</span></p>"';

		const {
			prefixTags,
			prefixTagsHtml,
			strippedHtml,
			strippedPlainText,
			tags,
		} = parseSpark(content, html);

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
		} = parseSpark(content, html);

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
		} = parseSpark(content, html);

		expect(prefixTags).toEqual(expectedPrefixTags);
		expect(tags).toEqual(expectedTags);
		expect(prefixTagsHtml).toEqual(expectedPrefixTagsHtml);
		expect(strippedPlainText).toEqual(expectStrippedPlainText);
		expect(strippedHtml).toEqual(expectStrippedHtml);
	});

	test("returns empty prefixTags and correct remainingTags when there are no prefix tags and one or more remaining tags", () => {
		const content = "Hello world #tag1 #tag2 #tag3";
		const html =
			'<p>Hello world <span style="--tag-color: 135" data-type="tags" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="tags" class="tag" data-id="tag2">#tag2</span> <span style="--tag-color: 145" data-type="tags" class="tag" data-id="tag3">#tag3</span></p>';
		const expectedPrefixTags: string[] = [];
		const expectedPrefixTagsHtml = "";
		const expectedTags = ["tag1", "tag2", "tag3"];
		const expectStrippedPlainText = "Hello world #tag1 #tag2 #tag3";
		const expectStrippedHtml =
			'<p>Hello world <span style="--tag-color: 135" data-type="tags" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="tags" class="tag" data-id="tag2">#tag2</span> <span style="--tag-color: 145" data-type="tags" class="tag" data-id="tag3">#tag3</span></p>';

		const {
			prefixTags,
			prefixTagsHtml,
			strippedHtml,
			strippedPlainText,
			tags,
		} = parseSpark(content, html);

		expect(prefixTags).toEqual(expectedPrefixTags);
		expect(tags).toEqual(expectedTags);
		expect(prefixTagsHtml).toEqual(expectedPrefixTagsHtml);
		expect(strippedPlainText).toEqual(expectStrippedPlainText);
		expect(strippedHtml).toEqual(expectStrippedHtml);
	});

	test("returns three prefix tags", () => {
		const content = "#tag1 #tag2 #tag3";
		const html =
			'<p><span style="--tag-color: 135" data-type="tags" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="tags" class="tag" data-id="tag2">#tag2</span> <span style="--tag-color: 145" data-type="tags" class="tag" data-id="tag3">#tag3</span></p>';
		const expectedPrefixTags: string[] = ["tag1", "tag2", "tag3"];
		const expectedPrefixTagsHtml =
			'<span style="--tag-color: 135" data-type="tags" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="tags" class="tag" data-id="tag2">#tag2</span> <span style="--tag-color: 145" data-type="tags" class="tag" data-id="tag3">#tag3</span> ';
		const expectedTags = ["tag1", "tag2", "tag3"];
		const expectStrippedPlainText = "";
		const expectStrippedHtml =
			'<p><span style="--tag-color: 135" data-type="tags" class="tag" data-id="tag1">#tag1</span> <span style="--tag-color: 140" data-type="tags" class="tag" data-id="tag2">#tag2</span> <span style="--tag-color: 145" data-type="tags" class="tag" data-id="tag3">#tag3</span></p>';

		const {
			prefixTags,
			prefixTagsHtml,
			strippedHtml,
			strippedPlainText,
			tags,
		} = parseSpark(content, html);

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
