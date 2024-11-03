type IconProps = {
	className?: string;
	overrideDefaultClassName?: boolean;
};

// Lucide
export const LampIcon = (props: IconProps) => {
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
			<path d="M8 2h8l4 10H4L8 2Z"/>
			<path d="M12 12v6"/>
			<path d="M8 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H8Z"/>
		</svg>
	);
};
