import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";
import { describe, it } from "vitest";

describe("EmptyState", () => {
	it("should render", () => {
		render(
			<EmptyState
				titleSlot="Hello world"
				textSlot="How are you?"
			/>,
		);

		expect(screen.getByText("Hello world")).toBeInTheDocument();
		expect(screen.getByText("How are you?")).toBeInTheDocument();
	});
});
