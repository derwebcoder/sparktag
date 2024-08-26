import type React from "react";

export type BadgeProps = {
	children: React.ReactNode;
};

export const Badge = (props: BadgeProps) => {
	const { children } = props;
	return (
		<span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">
			{children}
		</span>
	);
};
