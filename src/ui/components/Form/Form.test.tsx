import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form } from "./Form";

describe("Form", () => {
	it("should render", () => {
		render(<Form onSubmit={() => true}>Hello</Form>);

		expect(screen.getByText("Hello")).toBeInTheDocument();
	});

	it("should submit", async () => {
		const user = userEvent.setup();
		const handleSubmit = vi.fn();
		render(
			<Form onSubmit={handleSubmit}>
				<input
					type="text"
					name="name"
					aria-label="name"
				/>
			</Form>,
		);

		const input = screen.getByLabelText("name");
		await user.type(input, "Peter[Enter]");

		expect(handleSubmit).toHaveBeenCalledTimes(1);
	});
});
