import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { TextInput } from "./TextInput";
import userEvent from "@testing-library/user-event";

describe("TextInput", () => {
	it("should render", () => {
		render(<TextInput />);

		expect(screen.getByLabelText("Add a spark")).toBeInTheDocument();
	});

	it("should fire onSubmit", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<TextInput onSubmit={onSubmit} />);

		const input = screen.getByLabelText("Add a spark");

		await user.type(input, "Hello, world![Enter]");
		expect(onSubmit).toHaveBeenCalledWith(
			'<p class="text-gray-800 dark:text-neutral-200">Hello, world!</p>',
		);
	});
});
