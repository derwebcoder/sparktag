type IconProps = {
	className?: string;
	overrideDefaultClassName?: boolean;
};

// Lucide
export const ListTodoIcon = (props: IconProps) => {
	const { className, overrideDefaultClassName } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			stroke-linejoin="round"
			className={
				overrideDefaultClassName ? className : `size-5 ${className}`
			}
			role="presentation"
		>
			<rect x="3" y="5" width="6" height="6" rx="1"/>
			<path d="m3 17 2 2 4-4"/>
			<path d="M13 6h8"/>
			<path d="M13 12h8"/>
			<path d="M13 18h8"/>
		</svg>
	);
};
