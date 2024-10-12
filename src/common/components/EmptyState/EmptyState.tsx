import type React from "react";

export type EmptyStateProps = {
	titleSlot: React.ReactNode;
	textSlot: React.ReactNode;
};

export const EmptyState = (props: EmptyStateProps) => {
	const { titleSlot, textSlot } = props;
	return (
		<div className="flex flex-col gap-4 p-4 text-center">
			<span className="font-bold text-lg text-stone-700">
				{titleSlot}
			</span>
			<span className="text-stone-500">{textSlot}</span>
		</div>
	);
};
