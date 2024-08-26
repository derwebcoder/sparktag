import type { Meta, StoryObj } from "@storybook/react";

import { KeyIcon } from "../../icons/KeyIcon";
import { FormContainer } from "./FormContainer";
import { useForm } from "react-hook-form";
import { Input } from "../Input/Input";

export default {
	title: "Components/FormContainer",
	component: FormContainer,
} as Meta;

type Story = StoryObj<typeof FormContainer>;

export const Default: Story = {
	render: (args) => {
		const { register, handleSubmit } = useForm();
		return (
			<FormContainer
				{...args}
				title="Get ready"
				subtitle="Your journey starts here."
				onSubmit={handleSubmit(() => null)}
				submitText="Get in now"
			>
				<Input
					id="secret"
					label="Secret"
					name="secret"
					type="password"
					iconSlot={<KeyIcon />}
					placeholder="Enter the secret ..."
					register={register}
				/>
			</FormContainer>
		);
	},
	args: {
		title: "Get ready",
		subtitle: "Your journey starts here.",
	},
};
