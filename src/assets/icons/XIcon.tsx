type IconProps = {
	className?: string;
	overrideDefaultClassName?: boolean;
};

export const XIcon = (props: IconProps) => {
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
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M6 18 18 6M6 6l12 12"
			/>
		</svg>
	);
};
