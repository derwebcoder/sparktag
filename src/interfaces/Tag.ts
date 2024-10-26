import { Entity, type InsertType } from "dexie";
import type AppDB from "../scripts/db/AppDB";

export const tagIcons = [
	"alert-triangle",
	"bookmark",
	"calendar",
	"gift",
	"hash",
	"heart",
	"help-circle",
	"info",
	"lock",
	"mail",
	"map-pin",
	"shield",
	"star",
	"user",
	"users",
	"zap",
] as const;

export type TagIcon = (typeof tagIcons)[number];

export class Tag extends Entity<AppDB> {
	name!: string;
	hue!: number;
	description?: string;
	icon?: TagIcon;
}

export type PlainTag = InsertType<Tag, "description">;
