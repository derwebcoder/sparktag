import { format } from "date-fns";
import { toast } from "../../common/hooks/use-toast";
import { fileSystemService } from "../db/FileSystemHandleService";
import BackupJSONWorker from "./backupJSONWorker?worker";

const initialTimeOff = 5 * 60 * 1000;
const intervall = 6 * 60 * 60 * 1000;
const maxKeepBackups = 5;

const createBackup = async () => {
	const directoryHandle = (await fileSystemService.getFileHandle())
		?.fileHandle;

	if (!directoryHandle) {
		toast({
			title: "Creating automatic backup failed",
			description:
				"Please open the settings and disable + enable automatic backups again.",
			variant: "destructive",
		});
		return;
	}

	try {
		const backupFiles: FileSystemFileHandle[] = [];
		for await (const [key, value] of directoryHandle.entries()) {
			if (
				value.kind === "file" &&
				key.endsWith("_-_Sparks_Backup.json")
			) {
				backupFiles.push(value);
			}
		}
		if (backupFiles.length > maxKeepBackups) {
			const collator = new Intl.Collator(undefined, {
				numeric: true,
				sensitivity: "base",
			});
			const sortedBackupFiles = backupFiles.toSorted((a, b) =>
				collator.compare(b.name, a.name),
			);
			// get the oldest files above the limit minus the one we will create later
			const readyForDeletion = sortedBackupFiles.slice(
				maxKeepBackups - 1,
			);
			for await (const fileToDelete of readyForDeletion) {
				directoryHandle.removeEntry(fileToDelete.name, {
					recursive: false,
				});
			}
		}
	} catch (e) {
		console.error(e);
		toast({
			title: "Automatic deletion of old backups failed",
			description: `Old backups in "${directoryHandle.name}" could not be deleted. Please open the settings and disable + enable automatic backups again.`,
			variant: "destructive",
		});
	}

	const newBackupFile = await directoryHandle.getFileHandle(
		`${format(new Date(), "yyyy-MM-dd")}_-_Sparks_Backup.json`,
		{ create: true },
	);

	const worker = new BackupJSONWorker();

	worker.onmessage = (e: MessageEvent<"success" | "fail">) => {
		if (e.data === "success") {
			toast({
				title: "New automatic backup created",
				description: "A new automatic backup has been created.",
			});
			fileSystemService.setLastAutomaticBackupDate(new Date());
			window.setTimeout(createBackup, intervall);
			return;
		}
		toast({
			title: "Automatic backup failed",
			description: `The backup could not be saved to "${directoryHandle.name}". Please open the settings and disable + enable automatic backups again.`,
			variant: "destructive",
		});
	};
	worker.postMessage(newBackupFile);
};

(async () => {
	if (!fileSystemService.isAutomaticBackupEnabled()) {
		return;
	}

	window.setTimeout(createBackup, initialTimeOff);
})();
