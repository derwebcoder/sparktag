import type { Meta, StoryObj } from "@storybook/react";

import { IconButton } from "./IconButton";
import { CogIcon } from "../../../assets/icons/CogIcon";

export default {
	title: "Components/IconButton",
	component: IconButton,
} as Meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
	render: (args) => {
		return (
			<IconButton {...args}>
				<CogIcon />
			</IconButton>
		);
	},
	args: {
		type: "button",
	},
};
