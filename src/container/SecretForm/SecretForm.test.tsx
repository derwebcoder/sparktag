import { render, screen } from "@testing-library/react";
import { SecretForm } from "./SecretForm";
import userEvent from "@testing-library/user-event";
import { config } from "../../config/config";

describe("SecretForm", () => {
	afterEach(() => {
		vitest.restoreAllMocks();
	});

	it("should render the SecretForm component", () => {
		render(<SecretForm />);

		expect(
			screen.getByText("Are you part of the closed beta user group?"),
		).toBeInTheDocument();
	});

	it("should log in", async () => {
		// test secret: "secret"
		// hashed test secret: ""
		vi.spyOn(config, "getNotSoSecretSecret").mockImplementation(
			() =>
				"2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b",
		);
		Object.defineProperty(window, "location", {
			value: {
				replace: vi.fn(),
			},
			configurable: true,
		});
		vi.spyOn(window.location, "replace");
		const user = userEvent.setup();
		render(<SecretForm />);

		const secretInput = screen.getByLabelText("What is the secret?");
		const submitButton = screen.getByRole("button", { name: "Get in now" });

		await user.type(secretInput, "secret");
		await user.click(submitButton);

		expect(window.location.replace).toHaveBeenCalledTimes(1);
	});

	it("should fail on wrong password", async () => {
		Object.defineProperty(window, "location", {
			value: {
				replace: vi.fn(),
			},
			configurable: true,
		});
		vi.spyOn(window.location, "replace");
		const user = userEvent.setup();
		render(<SecretForm />);

		const secretInput = screen.getByLabelText("What is the secret?");
		const submitButton = screen.getByRole("button", { name: "Get in now" });

		// we do not mock the secret here, so the test will fail
		await user.type(secretInput, "secret");
		await user.click(submitButton);

		expect(window.location.replace).not.toHaveBeenCalled();
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"😢 Sadly that is not correct.",
		);
	});
});
