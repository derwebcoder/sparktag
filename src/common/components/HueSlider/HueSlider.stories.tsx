import type { Meta, StoryObj } from "@storybook/react";
import { HueSlider } from "./HueSlider";
import { useState } from "react";

export default {
	title: "Components/HueSlider",
	component: HueSlider,
	decorators: [
		(Story, { args }) => {
			const [hue, setHue] = useState(args.hue);
			const handleChange = (v: number) => {
				setHue(v);
			};
			return Story({
				args: {
					hue,
					onChange: handleChange,
				},
			});
		},
	],
} as Meta;

type Story = StoryObj<typeof HueSlider>;

export const Default: Story = {
	args: {
		hue: 25,
	},
};
