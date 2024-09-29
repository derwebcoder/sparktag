import Dexie, { type EntityTable } from "dexie";
import Spark from "../../interfaces/Spark";
import type FileSystemHandleStore from "../../interfaces/FileSystemHandleStore";

export default class AppDB extends Dexie {
	sparks!: EntityTable<Spark, "id">;
	fileHandles!: EntityTable<FileSystemHandleStore, "id">;

	constructor() {
		super("SparksDB");
		this.version(5).stores({
			sparks: "++id, creationDate, plainText, tags, contextTags",
			// this is needed to store the FileSystemHandle for automatic backups
			fileHandles: "++id, fileHandle",
		});
		this.sparks.mapToClass(Spark);
	}
}
