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
			className="tag w-fit text-sm"
			data-icon={icon}
			data-type="tags"
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
