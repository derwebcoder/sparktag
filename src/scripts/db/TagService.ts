import type { PlainTag, Tag } from "../../interfaces/Tag";
import { stringToHue, toLowerCase } from "../utils/stringUtils";
import type AppDB from "./AppDB";
import { db } from "./AppDB";

type TagToHueMap = Record<Tag["name"], Tag["hue"]>;

export class TagService {
	private tagToHueCache: TagToHueMap = {};

	constructor(private db: AppDB) {
		this.updateCache();
	}

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
			name: toLowerCase(name),
			hue,
			description,
		});
		this.updateCache();
	}

	public async updateHue(name: string, hue: number) {
		await this.db.tags.update(name, { hue });
	}

	public async updateDescription(name: string, description: string) {
		await this.db.tags.update(name, { description });
	}

	public async getTagHue(name: string) {
		const existingTag = await this.db.tags.get(name);
		if (existingTag) {
			return existingTag.hue;
		}
		return stringToHue(name);
	}

	public getTagHueFromCache(name: string) {
		return this.tagToHueCache[name] ?? stringToHue(name);
	}

	public async find(query: string, limit = 20) {
		return await this.db.tags
			.where("name")
			.startsWith(query)
			.limit(limit)
			.toArray();
	}

	public async listTags() {
		return await this.db.tags.toArray();
	}

	private async updateCache() {
		const tags = await this.listTags();
		this.tagToHueCache = tags.reduce<TagToHueMap>((tagToHue, tag) => {
			tagToHue[tag.name] = tag.hue;
			return tagToHue;
		}, {});
	}

	public async CAREFUL_deleteAllData() {
		await this.db.tags.clear();
	}

	public async CAREFUL_deleteAndImportTags(tags: PlainTag[]) {
		await this.CAREFUL_deleteAllData();
		tags.map((tag) => {
			this.db.tags.add(tag);
		});
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
