import type { Spark } from "../../interfaces/Spark";
import type { Tag } from "../../interfaces/Tag";
import { tagService } from "../db/TagService";

export const buildTagMap = (tags: Tag[]) =>
	new Map(tags.map((t) => [t.name, t]));

export const buildTagMapForSpark = async (spark: Spark) => {
	return new Map(
		buildTagMap(
			(
				await Promise.all(spark.tags.map((t) => tagService.get(t)))
			).filter((t) => typeof t !== "undefined"),
		),
	);
};
