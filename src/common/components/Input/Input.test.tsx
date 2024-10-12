import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./Input";
import { describe, it } from "vitest";

const Wrapper = ({
	handleSubmit,
}: {
	handleSubmit?: SubmitHandler<FieldValues>;
}) => {
	const { register, handleSubmit: RHFHandleSubmit } = useForm();
	return (
		<form
			onSubmit={RHFHandleSubmit(
				handleSubmit || ((data, e) => e?.preventDefault()),
			)}
		>
			<Input
				id="password"
				label="Password"
				required={true}
				register={register}
				name="password"
			/>
		</form>
	);
};

describe("Input", () => {
	it("should add the correct label", () => {
		render(<Wrapper />);

		expect(screen.getByLabelText("Password")).toBeInTheDocument();
	});

	it("should submit the correct data", async () => {
		const user = userEvent.setup();
		const handleSubmit = vitest.fn((data, e) => e.preventDefault());
		render(<Wrapper handleSubmit={handleSubmit} />);

		const input = screen.getByLabelText("Password");
		await user.type(input, "secret123[Enter]");

		expect(handleSubmit).toHaveBeenCalledTimes(1);
		expect(handleSubmit).toHaveBeenCalledWith(
			{ password: "secret123" },
			expect.anything(),
		);
	});
});
