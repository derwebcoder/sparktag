import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./TextInput";

export default {
	title: "Components/TextInput",
	component: TextInput,
} as Meta;

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
	args: {},
};
