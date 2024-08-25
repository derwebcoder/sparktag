import type { Meta, StoryObj } from "@storybook/react";

import { KeyIcon } from "../../icons/KeyIcon";
import { Form } from "./Form";

export default {
	title: "Components/Form",
	component: Form,
} as Meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
	args: {
		children: (
			<>
				<label className="form-control w-full">
					<div className="label">
						<span className="label-text">Username</span>
					</div>
					<div className="input input-bordered flex items-center gap-2">
						<input type="text" />
					</div>
				</label>
				<label className="form-control w-full">
					<div className="label">
						<span className="label-text">Password</span>
					</div>
					<div className="input input-bordered flex items-center gap-2">
						<KeyIcon className="stroke-neutral" />
						<input type="password" placeholder="Enter the secret ..." />
					</div>
				</label>
			</>
		),
	},
};
