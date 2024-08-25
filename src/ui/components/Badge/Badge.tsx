import type React from "react";

export type BadgeProps = {
	children: React.ReactNode;
};

export const Badge = (props: BadgeProps) => {
	const { children } = props;
	return (
		<span className="badge py-3 px-3 border-0 bg-emerald-700 text-emerald-50 font-bold text-xs">
			{children}
		</span>
	);
};
