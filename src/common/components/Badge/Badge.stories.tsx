import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

export default {
	title: "Components/Badge",
	component: Badge,
} as Meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
	args: {
		children: "TRY ME NOW",
	},
};
