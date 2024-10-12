import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";

export default {
	title: "Components/EmptyState",
	component: EmptyState,
} as Meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
	args: {
		titleSlot: "Create your first Spark.",
		textSlot:
			"Sparks can be of any topic. Use #tags to structure your Sparks. #tags added to the beginning of a Spark are used as context. Try adding your first one.",
	},
};
