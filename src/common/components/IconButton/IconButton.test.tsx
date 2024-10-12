import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "./IconButton";
import { CogIcon } from "../../../assets/icons/CogIcon";
import { describe, it } from "vitest";

describe("IconButton", () => {
	it("should render", () => {
		render(<IconButton>My button</IconButton>);

		expect(screen.getByText("My button")).toBeInTheDocument();
	});

	it("should trigger onClick", async () => {
		const user = userEvent.setup();
		const handleClick = vitest.fn((e) => e.preventDefault());
		render(
			<IconButton
				onClick={handleClick}
				type="button"
			>
				<CogIcon />
			</IconButton>,
		);

		const button = screen.getByRole("button");
		await user.click(button);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
