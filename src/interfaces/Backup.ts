import type { TagIcon } from "./Tag";

export type Backup = {
	version: 5 | 6 | 7 | 8 | 9;
};
// biome-ignore lint/suspicious/noExplicitAny: this is a type guard, this is fine
export const isBackup = (backup: any): backup is Backup => {
	return typeof backup.version === "number";
};

export type BackupV9 = Backup & {
	version: 9;
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
		icon?: TagIcon;
		description?: string;
	}[];
};
// biome-ignore lint/suspicious/noExplicitAny: this is a type guard, this is fine
export const isBackupV9 = (backup: any): backup is BackupV9 => {
	return backup.version === 9 && backup.sparks && backup.tags;
};

export type BackupV8 = Backup & {
	version: 8;
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
		icon?: string;
		description?: string;
	}[];
};
// biome-ignore lint/suspicious/noExplicitAny: this is a type guard, this is fine
export const isBackupV8 = (backup: any): backup is BackupV8 => {
	return backup.version === 8 && backup.sparks && backup.tags;
};

export type BackupV7 = Backup & {
	version: 7;
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
		icon?: string;
		description?: string;
	}[];
};
// biome-ignore lint/suspicious/noExplicitAny: this is a type guard, this is fine
export const isBackupV7 = (backup: any): backup is BackupV7 => {
	return backup.version === 7 && backup.sparks && backup.tags;
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
