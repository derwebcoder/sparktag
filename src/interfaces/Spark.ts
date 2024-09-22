import { Entity } from "dexie";
import type AppDB from "../scripts/db/AppDB";

export default class Spark extends Entity<AppDB> {
	id!: number;
	plainText!: string;
	html!: string;
	creationDate!: number;
	tags!: string[];
	contextTags!: string[];
}
