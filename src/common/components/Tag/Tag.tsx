import type React from "react";

export type TagProps = {
	name: string;
	hue: number;
	icon?: string;
};

export const Tag = (props: TagProps) => {
	const { name, hue, icon } = props;
	return (
		<span
			className="font-semibold tag w-fit text-sm"
			data-icon={icon}
			style={
				{
					"--tag-color": hue,
				} as React.CSSProperties
			}
		>
			{name}
		</span>
	);
};
