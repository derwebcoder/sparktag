import { vi } from "vitest";
// this import needs to be before the spark service import
import "fake-indexeddb/auto";
import { SparkService } from "./SparkService";
import type AppDB from "./AppDB";

describe("SparkService", () => {
	let sparkService: SparkService;
	let db: AppDB;
	const toArrayMock = vi.fn();

	beforeEach(() => {
		db = {
			sparks: {
				get: vi.fn(),
				add: vi.fn(),
				update: vi.fn(),
				delete: vi.fn(),
				orderBy: vi.fn().mockReturnValue({
					reverse: vi.fn().mockReturnValue({
						filter: vi.fn().mockReturnValue({
							toArray: toArrayMock,
						}),
						toArray: toArrayMock,
					}),
				}),
				toCollection: vi.fn().mockReturnValue({
					reverse: vi.fn().mockReturnValue({ sortBy: vi.fn() }),
				}),
				clear: vi.fn(),
			},
			tags: {
				where: vi.fn().mockReturnValue({
					anyOf: vi.fn().mockReturnValue({
						toArray: vi.fn(),
					}),
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
				originalHtml: html,
				creationDate: expect.any(Number),
				tags: expect.any(Array),
				contextTags: expect.any(Array),
			});
		});
	});

	describe("updateSpark", () => {
		test("updates a spark in the database", async () => {
			const id = 1;

			await sparkService.updateSpark(id, "plaintext", "<p>html</p>");

			expect(db.sparks.update).toHaveBeenCalledWith(
				id,
				expect.any(Object),
			);
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
			await sparkService.listSparks();

			expect(db.sparks.orderBy).toHaveBeenCalled();
			expect(toArrayMock).toHaveBeenCalled();
		});
	});
});
