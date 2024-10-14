import Dexie, { type EntityTable, type InsertType, type Table } from "dexie";
import { Spark } from "../../interfaces/Spark";
import type { FileSystemHandleStore } from "../../interfaces/FileSystemHandleStore";
import type { Tag } from "../../interfaces/Tag";
import { removeHash, stringToHue } from "../utils/stringUtils";

export default class AppDB extends Dexie {
	tags!: Table<Tag, string, InsertType<Tag, "name">>;
	sparks!: EntityTable<Spark, "id">;
	fileHandles!: EntityTable<FileSystemHandleStore, "id">;

	constructor() {
		super("SparksDB");
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
				// remove '#' char from existing tags
				// and tags should now contain all tags, including the contextTags
				transaction
					.table("sparks")
					.toCollection()
					.modify((spark: Spark) => {
						console.debug(`Modifying spark ${spark.id}`);
						const tagSet = new Set([
							...spark.tags,
							...spark.contextTags,
						]);
						console.debug("tagSet", [...tagSet]);
						spark.tags = [...tagSet].map(removeHash);
						spark.contextTags = spark.contextTags.map(removeHash);

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
						hue: stringToHue(tag),
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
