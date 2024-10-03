import classNames from "classnames";
import { forwardRef } from "react";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	relevancy?: "primary" | "secondary";
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	(props, ref) => {
		const { children, relevancy = "primary", ...buttonProps } = props;

		return (
			<button
				{...buttonProps}
				ref={ref}
				className={classNames(
					"size-8 rounded-full stroke-white text-white hover:bg-blue-500 active:bg-blue-600 place-content-center place-items-center flex outline-offset-2 shadow-md shadow-blue-400",
					{
						"bg-blue-400": relevancy === "primary",
						"bg-stone-400": relevancy === "secondary",
					},
				)}
			>
				{children}
			</button>
		);
	},
);
