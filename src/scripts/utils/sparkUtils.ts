import type { Spark } from "../../interfaces/Spark";
import type { TagMap } from "../db/TagService";

export const updateHtmlTagsOfSpark = (spark: Spark, tagMap: TagMap) => {
	const containerOriginalHtml = document.createElement("div");
	containerOriginalHtml.innerHTML = spark.originalHtml;
	const updatedOriginalHtml = updateHtmlTags(containerOriginalHtml, tagMap);

	const containerHtml = document.createElement("div");
	containerHtml.innerHTML = spark.html;
	const updatedHtml = updateHtmlTags(containerHtml, tagMap);

	return {
		html: updatedHtml,
		originalHtml: updatedOriginalHtml,
	};
};

const updateHtmlTags = (container: HTMLElement, tagMap: TagMap) => {
	const tagNodes = Array.from(
		container.querySelectorAll<HTMLSpanElement>(".tag[data-type=tags]"),
	);

	for (const tagNode of tagNodes) {
		if (tagNode.innerText.trim().startsWith("#")) {
			tagNode.innerText = tagNode.innerText.replace("#", "");
		}

		const tagName = tagNode.dataset.id;

		if (!tagName) {
			continue;
		}
		const icon = tagMap.get(tagName)?.icon ?? "hash";
		const hue = tagMap.get(tagName)?.hue ?? 25;
		tagNode.dataset.icon = icon;

		tagNode.style.setProperty("--tag-color", `${hue}`);
	}

	return container.innerHTML;
};
