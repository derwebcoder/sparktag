import {
	isBackup,
	isBackupV5,
	isBackupV6,
	type Backup,
	type BackupV6,
} from "../../interfaces/Backup";
import type { PlainSpark, Spark } from "../../interfaces/Spark";
import { sparkService } from "../db/SparkService";
import { tagService } from "../db/TagService";
import { removeHash, stringToHue } from "../utils/stringUtils";

const upgradeMap = {
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
			typeof upgradeMap[upgradeLevel as Backup["version"]] !== "undefined"
		) {
			backup = upgradeMap[upgradeLevel as Backup["version"]](backup);
			upgradeLevel += 1;
		}

		if (!isBackupV6(backup)) {
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
