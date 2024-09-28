import type { Meta, StoryObj } from "@storybook/react";

import { useForm } from "react-hook-form";
import { Input } from "./Input";
import { KeyIcon } from "../../../assets/icons/KeyIcon";

export default {
	title: "Components/Input",
	component: Input,
} as Meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
	render: (args) => {
		const { register } = useForm();
		return (
			<Input
				{...args}
				register={register}
			/>
		);
	},
	args: {
		id: "name",
		label: "Name",
		name: "name",
	},
};

export const WithIcon: Story = {
	...Default,
	args: {
		...Default.args,
		iconSlot: <div>✋</div>,
		id: "password",
		label: "Password",
		name: "password",
		type: "password",
	},
};

export const Disabled: Story = {
	...Default,
	args: {
		...Default.args,
		iconSlot: <KeyIcon />,
		id: "hair-style",
		label: "Hair style",
		name: "hair-style",
		type: "text",
		// disabled: true,
	},
};
