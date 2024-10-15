import { Entity, type InsertType } from "dexie";
import type AppDB from "../scripts/db/AppDB";
import type { Tag } from "./Tag";

export class Spark extends Entity<AppDB> {
	id!: number;
	plainText!: string;
	html!: string;
	originalHtml!: string;
	creationDate!: number;
	tags!: string[];
	contextTags!: string[];
}

export type PlainSpark = InsertType<Spark, "id">;

export class SparkWithTagData {
	spark: Spark;
	tagData: Tag[];
	contextTagData: Tag[];

	constructor(spark: Spark, tagData: Tag[]) {
		this.spark = spark;
		this.tagData = tagData;
		this.contextTagData = spark.contextTags
			.map((contextTag) => tagData.find((t) => t.name === contextTag))
			.filter((t) => typeof t !== "undefined");
	}
}
