import type { Meta, StoryObj } from "@storybook/react";

import { useForm } from "react-hook-form";
import { PasswordInput } from "./PasswordInput";

export default {
	title: "Components/PasswordInput",
	component: PasswordInput,
} as Meta;

type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
	render: (args) => {
		const { register } = useForm();
		return <PasswordInput {...args} register={register} />;
	},
	args: {
		label: "Password",
		required: true,
	},
};
