import { Entity } from "dexie";
import type AppDB from "../scripts/db/AppDB";

export default class FileSystemHandleStore extends Entity<AppDB> {
	id!: number;
	fileHandle!: FileSystemDirectoryHandle;
}
