import type AppDB from "./AppDB";
import { db } from "./AppDB";
import {
	SparkWithTagData,
	type PlainSpark,
	type Spark,
} from "../../interfaces/Spark";
import { parseSpark, stringToHue } from "../utils/stringUtils";
import { tagService } from "./TagService";
import type { PlainTag } from "../../interfaces/Tag";

export class SparkService {
	constructor(private db: AppDB) {}

	public async addSpark(plainText: string, html: string) {
		const { tags, prefixTags, strippedPlainText, strippedHtml } =
			parseSpark(plainText, html);

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

	public async listSparks() {
		return await this.db.sparks.orderBy("creationDate").reverse().toArray();
	}

	public async find(tags: string[]) {
		if (tags.length <= 0) {
			return this.listSparksWithTags();
		}
		const sparks = await this.db.sparks
			.orderBy("creationDate")
			.reverse()
			.filter((spark) => {
				for (const tag of tags) {
					if (!spark.tags.includes(tag)) {
						return false;
					}
				}
				return true;
			})
			.toArray(this.mergeWithTags.bind(this));

		return sparks;
	}

	public async listSparksWithTags() {
		const sparks = await this.db.sparks
			.orderBy("creationDate")
			.reverse()
			.toArray(this.mergeWithTags.bind(this));

		return sparks;
	}

	private async mergeWithTags(sparks: Spark[]) {
		const tags = await Promise.all(
			sparks.map((spark) => {
				return this.db.tags.where("name").anyOf(spark.tags).toArray();
			}),
		);
		return sparks.map((spark, index) => {
			return new SparkWithTagData(spark, tags[index]);
		});
	}

	public async CAREFUL_deleteAllData() {
		await this.db.sparks.clear();
	}

	public async CAREFUL_deleteAndImportSparks(sparks: PlainSpark[]) {
		await this.CAREFUL_deleteAllData();
		sparks.map((spark) => {
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
