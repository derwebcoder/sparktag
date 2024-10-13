import Dexie, { type EntityTable, type InsertType, type Table } from "dexie";
import { Spark } from "../../interfaces/Spark";
import type { FileSystemHandleStore } from "../../interfaces/FileSystemHandleStore";
import type Tag from "../../interfaces/Tag";

export default class AppDB extends Dexie {
	tags!: Table<Tag, string, InsertType<Tag, "name">>;
	sparks!: EntityTable<Spark, "id">;
	fileHandles!: EntityTable<FileSystemHandleStore, "id">;

	constructor() {
		super("SparksDB");
		this.version(5).stores({
			sparks: "++id, creationDate, plainText, tags, contextTags",
			// because name is the first index, it is the primary key and unique
			tags: "name, description",
			// this is needed to store the FileSystemHandle for automatic backups
			fileHandles: "++id, fileHandle",
		});
		this.sparks.mapToClass(Spark);
	}
}

export const db = new AppDB();
