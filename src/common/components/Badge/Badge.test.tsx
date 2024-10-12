import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";
import { describe, it } from "vitest";

describe("Badge", () => {
	it("should render", () => {
		render(<Badge>NEW AND SHINY</Badge>);

		expect(screen.getByText("NEW AND SHINY")).toBeInTheDocument();
	});
});
