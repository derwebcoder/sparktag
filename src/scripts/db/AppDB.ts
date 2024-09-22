import Dexie, { type EntityTable } from "dexie";
import Spark from "../../interfaces/Spark";

export default class AppDB extends Dexie {
	sparks!: EntityTable<Spark, "id">;

	constructor() {
		super("SparksDB");
		this.version(5).stores({
			sparks: "++id, creationDate, plainText, tags, contextTags",
		});
		this.sparks.mapToClass(Spark);
	}
}
