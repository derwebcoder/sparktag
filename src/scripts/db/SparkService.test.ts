import { vi } from "vitest";
import { SparkService } from "./SparkService";
import type AppDB from "./AppDB";

describe("SparkService", () => {
	let sparkService: SparkService;
	let db: AppDB;

	beforeEach(() => {
		db = {
			sparks: {
				add: vi.fn(),
				update: vi.fn(),
				delete: vi.fn(),
				toCollection: vi.fn().mockReturnValue({
					reverse: vi.fn().mockReturnValue({ sortBy: vi.fn() }),
				}),
			},
		} as unknown as AppDB;
		sparkService = new SparkService(db);
	});

	describe("addSpark", () => {
		test("adds a spark to the database", async () => {
			const plainText = "Sample spark content";
			const html = "<span>Sample spark content<span>";

			await sparkService.addSpark(plainText, html);

			expect(db.sparks.add).toHaveBeenCalledWith({
				plainText: plainText,
				html: html,
				creationDate: expect.any(Number),
				tags: expect.any(Array),
				contextTags: expect.any(Array),
			});
		});
	});

	describe("updateSpark", () => {
		test("updates a spark in the database", async () => {
			const id = 1;
			const updates = { plainText: "Updated spark content" };

			await sparkService.updateSpark(id, updates);

			expect(db.sparks.update).toHaveBeenCalledWith(id, updates);
		});
	});

	describe("deleteSpark", () => {
		test("deletes a spark from the database", async () => {
			const id = 1;

			await sparkService.deleteSpark(id);

			expect(db.sparks.delete).toHaveBeenCalledWith(id);
		});
	});

	describe("listSparks", () => {
		test("returns a sorted list of sparks from the database", async () => {
			await sparkService.listSparksWithTags();

			expect(db.sparks.toCollection).toHaveBeenCalled();
			expect(
				db.sparks.toCollection().reverse().sortBy,
			).toHaveBeenCalledWith("creationDate");
		});
	});
});
