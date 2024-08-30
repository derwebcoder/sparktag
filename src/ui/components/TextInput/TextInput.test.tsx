import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { TextInput } from "./TextInput";

describe("TextInput", () => {
	it("should render", () => {
		render(<TextInput />);

		expect(screen.getByLabelText("Add a spark")).toBeInTheDocument();
	});

	// Testing this is not easy because it's a contenteditable div which
	// relies on a browser environment that is not mocked by jsdom / happy-dom.
	// See https://github.com/ueberdosis/tiptap/discussions/4008 for more context
	// and a possible solution. Though I decided it's easier to test this via
	// playwright tests.
	// it("should fire onSubmit", async () => {
	// 	const user = userEvent.setup();
	// 	const onSubmit = vi.fn();
	// 	render(<TextInput onSubmit={onSubmit} />);

	// 	const input = screen.getByLabelText("Add a spark");

	// 	await user.type(input, "Hello, world![Enter]");

	// 	await waitFor(() =>
	// 		expect(onSubmit).toHaveBeenCalledWith(
	// 			'<p class="text-gray-800 dark:text-neutral-200">Hello, world!</p>',
	// 		),
	// 	);
	// });
});
