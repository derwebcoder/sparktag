type IconProps = {
	className?: string;
	overrideDefaultClassName?: boolean;
};

// Lucide
export const LampWallUpIcon = (props: IconProps) => {
	const { className, overrideDefaultClassName } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className={
				overrideDefaultClassName ? className : `size-5 ${className}`
			}
			role="presentation"
		>
			<path d="M11 4h6l3 7H8l3-7Z"/>
			<path d="M14 11v5a2 2 0 0 1-2 2H8"/>
			<path d="M4 15h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4v-6Z"/>
		</svg>
	);
};
