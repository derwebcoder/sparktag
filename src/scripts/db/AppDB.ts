import Dexie, { type EntityTable, type InsertType, type Table } from "dexie";
import { Spark } from "../../interfaces/Spark";
import type { FileSystemHandleStore } from "../../interfaces/FileSystemHandleStore";
import type { Tag } from "../../interfaces/Tag";
import { removeHash, stringToHue, toLowerCase } from "../utils/stringUtils";
import { updateHtmlTagsOfSpark } from "../utils/sparkUtils";

export default class AppDB extends Dexie {
	tags!: Table<Tag, string, InsertType<Tag, "name">>;
	sparks!: EntityTable<Spark, "id">;
	fileHandles!: EntityTable<FileSystemHandleStore, "id">;

	constructor() {
		super("SparksDB");
		// nothing really changes in this version, but we need to update the existing tags in the html
		this.version(9)
			.stores({
				sparks: "++id, creationDate, plainText, tags, contextTags",
				// because name is the first index, it is the primary key and unique
				tags: "name, description",
				// this is needed to store the FileSystemHandle for automatic backups
				fileHandles: "++id, fileHandle",
			})
			.upgrade(async (transaction) => {
				console.debug("Upgrading Dexie Table to version 7");

				const tagMap = new Map(
					(await transaction.table("tags").toArray()).map(
						(t: Tag) => [t.name, t] as [Tag["name"], Tag],
					),
				);
				// remove '#' char from existing tags and make them lowercase
				// and tags should now contain all tags, including the contextTags
				transaction
					.table("sparks")
					.toCollection()
					.modify((spark: Spark) => {
						const { html, originalHtml } = updateHtmlTagsOfSpark(
							spark,
							tagMap,
						);
						console.debug({ html, originalHtml });
						spark.html = html;
						spark.originalHtml = originalHtml;
					});
			});
		this.version(6)
			.stores({
				sparks: "++id, creationDate, plainText, tags, contextTags",
				// because name is the first index, it is the primary key and unique
				tags: "name, description",
				// this is needed to store the FileSystemHandle for automatic backups
				fileHandles: "++id, fileHandle",
			})
			.upgrade(async (transaction) => {
				console.debug("Upgrading Dexie Table to version 6");
				// remove '#' char from existing tags and make them lowercase
				// and tags should now contain all tags, including the contextTags
				transaction
					.table("sparks")
					.toCollection()
					.modify((spark: Spark) => {
						console.debug(`Modifying spark ${spark.id}`);
						const tagSet = new Set([
							...spark.tags.map<string>(toLowerCase),
							...spark.contextTags.map<string>(toLowerCase),
						]);
						console.debug("tagSet", [...tagSet]);
						spark.tags = [...tagSet].map(removeHash);
						spark.contextTags = spark.contextTags
							.map(removeHash)
							.map<string>(toLowerCase);

						// we don't have the original anymore, so this has to be good enough
						spark.originalHtml = spark.html;
					});

				// Create new tags table out of existing tags
				const tags = new Set(
					(await transaction.table("sparks").toArray()).flatMap(
						(spark: Spark) => {
							return spark.tags;
						},
					),
				);
				console.debug("All tags", tags);
				const tagsTable: Table<
					Tag,
					string,
					InsertType<Tag, "name">
				> = transaction.table("tags");
				tagsTable.bulkAdd(
					[...tags].map((tag) => ({
						name: tag,
						hue: stringToHue(`#${tag}`),
					})),
				);
			});
		this.version(5).stores({
			sparks: "++id, creationDate, plainText, tags, contextTags",
			// this is needed to store the FileSystemHandle for automatic backups
			fileHandles: "++id, fileHandle",
		});
		this.sparks.mapToClass(Spark);
	}
}

export const db = new AppDB();
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
(window as any).db = db;
