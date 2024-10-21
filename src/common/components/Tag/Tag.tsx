import type React from "react";

export type TagProps = {
	name: string;
	hue: number;
};

export const Tag = (props: TagProps) => {
	const { name, hue } = props;
	return (
		<span
			className="font-semibold tag w-fit text-sm"
			style={
				{
					"--tag-color": hue,
				} as React.CSSProperties
			}
		>
			#{name}
		</span>
	);
};
