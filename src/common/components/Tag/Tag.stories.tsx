import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./Tag";

export default {
	title: "Components/Tag",
	component: Tag,
} as Meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {
	args: {
		name: "wilderness",
		hue: 321,
	},
};

export const Neon: Story = {
	args: {
		name: "wilderness",
		hue: 321,
	},
	decorators: [
		(Story) => (
			<div className="neon">
				<Story />
			</div>
		),
	],
};

export const ChipLight: Story = {
	args: {
		name: "wilderness",
		hue: 321,
	},
	decorators: [
		(Story) => (
			<div className="chip-light">
				<Story />
			</div>
		),
	],
};

export const ChipDark: Story = {
	args: {
		name: "wilderness",
		hue: 321,
	},
	decorators: [
		(Story) => (
			<div className="chip-dark">
				<Story />
			</div>
		),
	],
};

export const ChipBorder: Story = {
	args: {
		name: "wilderness",
		hue: 321,
	},
	decorators: [
		(Story) => (
			<div className="chip-border">
				<Story />
			</div>
		),
	],
};
