import { Entity } from "dexie";
import type AppDB from "../scripts/db/AppDB";

export class FileSystemHandleStore extends Entity<AppDB> {
	id!: number;
	fileHandle!: FileSystemDirectoryHandle;
}
