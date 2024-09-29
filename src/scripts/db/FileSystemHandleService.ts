import { toast } from "../../common/hooks/use-toast";
import AppDB from "./AppDB";

export class FileSystemHandleService {
	constructor(private db: AppDB) {}

	public async setFileHandle(handle: FileSystemDirectoryHandle) {
		await this.db.fileHandles.add({
			fileHandle: handle,
		});
	}

	public async getFileHandle() {
		return await this.db.fileHandles.toCollection().first();
	}

	public async CAREFUL_clearAllBackups() {
		const directoryHandle = (await this.getFileHandle())?.fileHandle;
		try {
			if (directoryHandle) {
				for await (const [key, value] of directoryHandle.entries()) {
					if (
						value.kind === "file" &&
						key.endsWith("_-_Sparks_Backup.json")
					) {
						await directoryHandle.removeEntry(value.name);
					}
				}
			}
		} catch (e) {
			console.error(e);
			toast({
				title: "Backups could not be deleted",
				description: `The backups in ${directoryHandle?.name} could not be deleted. Please do it manually.`,
				variant: "destructive",
			});
		}
		await this.db.fileHandles.clear();
		localStorage.removeItem("AUTOMATIC_BACKUPS_ENABLED");
		localStorage.removeItem("AUTOMATIC_BACKUP_LAST_DATE");
	}

	public isAutomaticBackupEnabled() {
		return localStorage.getItem("AUTOMATIC_BACKUPS_ENABLED") === "true";
	}

	public setAutomaticBackupEnabled(next: boolean) {
		localStorage.setItem("AUTOMATIC_BACKUPS_ENABLED", String(next));
	}

	public setLastAutomaticBackupDate(date: Date) {
		localStorage.setItem("AUTOMATIC_BACKUP_LAST_DATE", date.toISOString());
	}

	public getLastAutomaticBackupDate() {
		if (!localStorage.getItem("AUTOMATIC_BACKUP_LAST_DATE")) {
			return false;
		}
		return new Date(
			localStorage.getItem("AUTOMATIC_BACKUP_LAST_DATE") ?? 0,
		);
	}
}

declare global {
	interface Window {
		fileSystemHandleService: FileSystemHandleService;
	}
}

const db = new AppDB();
export const fileSystemService = new FileSystemHandleService(db);
if (typeof window !== "undefined") {
	window.fileSystemHandleService = fileSystemService;
}
