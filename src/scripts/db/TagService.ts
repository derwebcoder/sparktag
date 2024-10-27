import type { PlainTag, Tag, TagIcon } from "../../interfaces/Tag";
import { stringToHue, toLowerCase } from "../utils/stringUtils";
import { buildTagMap } from "../utils/tagUtils";
import type AppDB from "./AppDB";
import { db } from "./AppDB";
import { matchSorter } from "match-sorter";
import { sparkService } from "./SparkService";

export type TagMap = Map<Tag["name"], PlainTag>;

export class TagService {
	private tagMap: TagMap = new Map();

	constructor(private db: AppDB) {
		this.createCache();
	}

	public async get(name: string) {
		return await this.db.tags.get(name);
	}

	public async addIfNonExistent(
		name: string,
		hue: number,
		description?: string,
	) {
		const tagName = toLowerCase(name);
		const existCheck = await this.db.tags.get(tagName);
		if (existCheck) {
			return;
		}
		await this.db.tags.add({
			name: tagName,
			hue,
			description,
		});
		this.updateCache(tagName);
	}

	public async updateHue(name: string, hue: number) {
		await this.db.tags.update(name, { hue });

		await this.updateCache(name);

		await sparkService.updateTag(name, this.tagMap);
	}

	public async updateDescription(name: string, description: string) {
		await this.db.tags.update(name, { description });
	}

	public async updateIcon(name: string, icon: TagIcon) {
		await this.db.tags.update(name, { icon });

		await this.updateCache(name);

		await sparkService.updateTag(name, this.tagMap);
	}

	public async getTagHue(name: string) {
		const existingTag = await this.db.tags.get(name);
		if (existingTag) {
			return existingTag.hue;
		}
		return stringToHue(name);
	}

	public getTagHueFromCache(name: string) {
		return this.tagMap.get(name)?.hue ?? stringToHue(name);
	}

	public getTagIconFromCache(name: string) {
		return this.tagMap.get(name)?.icon ?? "hash";
	}

	public async find(query: string, limit = 20) {
		const tags = await this.db.tags.toArray();
		const matches = matchSorter(tags, query, {
			keys: [
				"name",
				{
					key: "description",
					maxRanking: matchSorter.rankings.STARTS_WITH,
				},
			],
		});
		return matches.slice(0, limit);
	}

	public async listTags() {
		return await this.db.tags.toArray();
	}

	private async createCache() {
		const tags = await this.listTags();
		this.tagMap = buildTagMap(tags);
	}

	private async updateCache(name: string) {
		const newTag = await this.db.tags.get(name);
		if (!newTag) {
			return;
		}
		this.tagMap.set(newTag.name, newTag);
	}

	public async deleteTag(name: string) {
		await this.db.tags.delete(name);
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
