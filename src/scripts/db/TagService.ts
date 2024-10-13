import { stringToHue } from "../utils/stringUtils";
import type AppDB from "./AppDB";
import { db } from "./AppDB";

export class TagService {
	constructor(private db: AppDB) {}

	public async addIfNonExistent(
		name: string,
		hue: number,
		description?: string,
	) {
		const existCheck = await this.db.tags.get(name);
		if (existCheck) {
			return;
		}
		await this.db.tags.add({
			name,
			hue,
			description,
		});
	}

	public async getTagHue(name: string) {
		const existingTag = await this.db.tags.get(name);
		if (existingTag) {
			return existingTag.hue;
		}
		return stringToHue(name);
	}

	public async find(query: string, limit = 20) {
		return await this.db.tags
			.where("name")
			.startsWith(query)
			.limit(limit)
			.toArray();
	}
}

declare global {
	interface Window {
		tagService: TagService;
	}
}

export const tagService = new TagService(db);
if (typeof window !== "undefined") {
	window.tagService = tagService;
}
