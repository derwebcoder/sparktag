import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormContainer } from "./FormContainer";

describe("FormContainer", () => {
	it("should render", () => {
		render(
			<FormContainer
				onSubmit={() => true}
				title="Some title"
				subtitle="Some subtitle"
			>
				Hello
			</FormContainer>,
		);

		expect(screen.getByText("Hello")).toBeInTheDocument();
	});

	it("should submit", async () => {
		const user = userEvent.setup();
		const handleSubmit = vi.fn();
		render(
			<FormContainer
				onSubmit={handleSubmit}
				title="Some title"
				subtitle="Some subtitle"
			>
				<input
					type="text"
					name="name"
					aria-label="name"
				/>
			</FormContainer>,
		);

		const input = screen.getByLabelText("name");
		await user.type(input, "Peter[Enter]");

		expect(handleSubmit).toHaveBeenCalledTimes(1);
	});
});
