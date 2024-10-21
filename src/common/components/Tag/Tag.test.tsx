import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Tag } from "./Tag";
import { describe, it } from "vitest";

describe("Tag", () => {
	it("should render", () => {
		render(
			<Tag
				name="world"
				hue={123}
			/>,
		);

		const tag = screen.getByText("#world");
		expect(tag).toBeInTheDocument();

		const style = getComputedStyle(tag);
		expect(style.getPropertyValue("--tag-color")).toBe("123");
	});
});
