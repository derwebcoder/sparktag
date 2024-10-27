import {
	isBackup,
	isBackupV5,
	isBackupV6,
	isBackupV7,
	isBackupV8,
	isBackupV9,
	type Backup,
	type BackupV6,
	type BackupV7,
	type BackupV8,
	type BackupV9,
} from "../../interfaces/Backup";
import type { PlainSpark } from "../../interfaces/Spark";
import type { PlainTag, Tag } from "../../interfaces/Tag";
import { sparkService } from "../db/SparkService";
import { tagService, type TagMap } from "../db/TagService";
import { updateHtmlTagsOfSpark } from "../utils/sparkUtils";
import { removeHash, stringToHue } from "../utils/stringUtils";

const upgradeToMap = {
	// This migration function would be called if we would have a version 8 backup
	9: (backup: Backup): BackupV9 => {
		if (!isBackupV8(backup)) {
			throw new Error("Upgrading import to v9 is not possible");
		}

		const tagMap: TagMap = new Map(
			backup.tags.map((t) => [t.name, t] as [Tag["name"], PlainTag]),
		);

		const sparks = backup.sparks.map((spark) => {
			const { html, originalHtml } = updateHtmlTagsOfSpark(spark, tagMap);
			spark.html = html;
			spark.originalHtml = originalHtml;
			return spark;
		});

		return {
			version: 9,
			tags: backup.tags as PlainTag[],
			sparks: sparks,
		};
	},
	// This migration function would be called if we would have a version 7 backup
	8: (backup: Backup): BackupV8 => {
		if (!isBackupV7(backup)) {
			throw new Error("Upgrading import to v8 is not possible");
		}
		return {
			...backup,
			version: 8,
		};
	},
	// This migration function would be called if we would have a version 6 backup
	7: (backup: Backup): BackupV7 => {
		if (!isBackupV6(backup)) {
			throw new Error("Upgrading import to v7 is not possible");
		}
		return {
			...backup,
			version: 7,
		};
	},
	// This migration function would be called if we would have a version 5 backup
	6: (backup: Backup): BackupV6 => {
		if (!isBackupV5(backup)) {
			throw new Error("Upgrading import to v6 is not possible");
		}
		const upgradedSparks = backup.sparks.map((spark) => {
			return {
				...spark,
				tags: [...new Set([...spark.tags, ...spark.contextTags])].map(
					removeHash,
				),
				contextTags: spark.contextTags.map(removeHash),
				originalHtml: spark.html,
			} satisfies PlainSpark;
		});
		const newTags = upgradedSparks.flatMap((s) => s.tags);
		return {
			version: 6,
			sparks: upgradedSparks,
			tags: newTags.map((tag) => ({
				name: tag,
				hue: stringToHue(tag),
			})),
		};
	},
	5: (backup: unknown) => backup as BackupV6,
} satisfies Record<Backup["version"], (backup: Backup) => Backup>;

self.onmessage = async (e: MessageEvent<string>) => {
	try {
		let backup = JSON.parse(e.data);

		if (!isBackup(backup)) {
			self.postMessage("fail");
			return;
		}

		// we look if we have one or more newer versions and go through the upgrade path for each
		let upgradeLevel = backup.version + 1;
		while (
			typeof upgradeToMap[upgradeLevel as Backup["version"]] !==
			"undefined"
		) {
			backup = upgradeToMap[upgradeLevel as Backup["version"]](backup);
			upgradeLevel += 1;
		}

		if (!isBackupV9(backup)) {
			self.postMessage("fail");
			return;
		}

		sparkService.CAREFUL_deleteAndImportSparks(backup.sparks);
		tagService.CAREFUL_deleteAndImportTags(backup.tags);

		self.postMessage("success");
	} catch (e) {
		console.error(e);
		self.postMessage("fail");
	}
};
