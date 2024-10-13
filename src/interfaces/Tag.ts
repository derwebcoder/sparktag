import { Entity } from "dexie";
import type AppDB from "../scripts/db/AppDB";

export default class Tag extends Entity<AppDB> {
	name!: string;
	hue!: number;
	description?: string;
}
