import type AppDB from "./AppDB";
import { db } from "./AppDB";
import { SparkWithTagData, type Spark } from "../../interfaces/Spark";
import { extractTags, stringToHue } from "../utils/stringUtils";
import { tagService } from "./TagService";

export class SparkService {
	constructor(private db: AppDB) {}

	public async addSpark(plainText: string, html: string) {
		const { tags, prefixTags, strippedPlainText, strippedHtml } =
			extractTags(plainText, html);

		for (const tag of tags) {
			tagService.addIfNonExistent(tag, stringToHue(`#${tag}`));
		}

		await this.db.sparks.add({
			plainText: strippedPlainText,
			html: strippedHtml,
			originalHtml: html,
			creationDate: Date.now(),
			tags,
			contextTags: prefixTags,
		});
	}

	public async updateSpark(id: number, updates: Partial<Spark>) {
		await this.db.sparks.update(id, { ...updates });
	}

	public async deleteSpark(id: number) {
		await this.db.sparks.delete(id);
	}

	public async listSparksWithTags() {
		const sparks = await this.db.sparks
			.orderBy("creationDate")
			.reverse()
			.toArray(async (sparks) => {
				const tags = await Promise.all(
					sparks.map((spark) => {
						return this.db.tags
							.where("name")
							.anyOf(spark.tags)
							.toArray();
					}),
				);
				return sparks.map((spark, index) => {
					return new SparkWithTagData(spark, tags[index]);
				});
			});

		return sparks;
	}

	public async CAREFUL_deleteAllData() {
		await this.db.sparks.clear();
	}

	public async CAREFUL_deleteAndImportSparks(sparks: Spark[]) {
		await this.CAREFUL_deleteAllData();
		await sparks.map((spark) => {
			this.db.sparks.add(spark);
		});
	}
}

declare global {
	interface Window {
		sparkService: SparkService;
	}
}

export const sparkService = new SparkService(db);
if (typeof window !== "undefined") {
	window.sparkService = sparkService;
}
