import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { HueSlider } from "./HueSlider";
import { describe, it } from "vitest";

describe("HueSlider", () => {
	it("should render", () => {
		render(
			<HueSlider
				hue={25}
				onChange={() => undefined}
			/>,
		);

		expect(screen.getByTestId("hue-input")).toBeInTheDocument();
	});
});
