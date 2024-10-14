import { Entity, type InsertType } from "dexie";
import type AppDB from "../scripts/db/AppDB";

export class Tag extends Entity<AppDB> {
	name!: string;
	hue!: number;
	description?: string;
}

export type PlainTag = InsertType<Tag, "name">;
