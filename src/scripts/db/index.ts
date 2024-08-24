import AppDB from "./AppDB";
import type Spark from "./Spark";

export const db = new AppDB();

class TestClass {
	public db = db;

	public async addSpark(content: string, ...tags: string[]) {
		await db.sparks.add({ content, creationDate: Date.now(), tags });
	}

	public async updateSpark(id: number, updates: Partial<Spark>) {
		await db.sparks.update(id, { ...updates });
	}

	public async deleteSpark(id: number) {
		await db.sparks.delete(id);
	}

	public async birthdaySpark(id: number) {
		await this.db.sparks.update(id, (spark) => {
			spark.content = `Happy birthday, ${spark.content}!`;
			return true;
		});
	}

	public async listSparks() {
		const sparks = await db.sparks.toCollection().sortBy("creationDate");
		console.log("#### SPARKS");
		console.table(
			sparks.map((s) => ({
				id: s.id,
				content: s.content,
				date: s.creationDate,
				tags: s.tags.join(", "),
			})),
		);
	}
}

declare global {
	interface Window {
		db: TestClass;
	}
}

window.db = new TestClass();

/*
a
b
c
a,b
// b,a
a,c
// c,a
b,c
// c,b
a,b,c
// b,a,c
// c,a,b
// a,c,b
// b,c,a
// c,b,a
*/
