export type Backup = {
	version: 5 | 6;
};
// biome-ignore lint/suspicious/noExplicitAny: this is a type guard, this is fine
export const isBackup = (backup: any): backup is Backup => {
	return typeof backup.version === "number";
};

export type BackupV5 = Backup & {
	version: 5;
	sparks: {
		id: number;
		plainText: string;
		html: string;
		creationDate: number;
		tags: string[];
		contextTags: string[];
	}[];
};
// biome-ignore lint/suspicious/noExplicitAny: this is a type guard, this is fine
export const isBackupV5 = (backup: any): backup is BackupV5 => {
	return backup.version === 5 && backup.sparks;
};

export type BackupV6 = Backup & {
	version: 6;
	sparks: {
		id: number;
		plainText: string;
		html: string;
		originalHtml: string;
		creationDate: number;
		tags: string[];
		contextTags: string[];
	}[];
	tags: {
		name: string;
		hue: number;
		description?: string;
	}[];
};
// biome-ignore lint/suspicious/noExplicitAny: this is a type guard, this is fine
export const isBackupV6 = (backup: any): backup is BackupV6 => {
	return backup.version === 6 && backup.sparks && backup.tags;
};
