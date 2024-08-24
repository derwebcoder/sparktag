import { Entity } from "dexie";
import type AppDB from "./AppDB";

export default class Spark extends Entity<AppDB> {
	id!: number;
	content!: string;
	creationDate!: number;
	tags!: string[];
}
