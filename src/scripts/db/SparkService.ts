import AppDB from "./AppDB";
import type Spark from "../../interfaces/Spark";
import { extractTags } from "../utils/stringUtils";

export class SparkService {
	constructor(private db: AppDB) {}

	public async addSpark(plainText: string, html: string) {
		const [prefixTags, remainingTags, strippedContent] =
			extractTags(plainText);
		await this.db.sparks.add({
			plainText: strippedContent,
			html,
			creationDate: Date.now(),
			tags: remainingTags,
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
		return await this.db.sparks
			.toCollection()
			.reverse()
			.sortBy("creationDate");
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

const db = new AppDB();
window.sparkService = new SparkService(db);
export const sparkService = window.sparkService;
