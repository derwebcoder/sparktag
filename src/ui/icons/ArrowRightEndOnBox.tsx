type IconProps = {
	className?: string;
	overrideDefaultClassName?: boolean;
};

export const ArrowRightEndOnBox = (props: IconProps) => {
	const { className, overrideDefaultClassName } = props;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className={
				overrideDefaultClassName ? className : `size-6 ${className}`
			}
			role="presentation"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
			/>
		</svg>
	);
};
