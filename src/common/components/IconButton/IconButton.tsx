import classNames from "classnames";
import { forwardRef } from "react";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	relevancy?: "primary" | "secondary" | 'ghost';
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	(props, ref) => {
		const { children, relevancy = "primary", ...buttonProps } = props;

		return (
			<button
				{...buttonProps}
				ref={ref}
				className={classNames(
					"size-8 rounded-full hover:bg-blue-500 active:bg-blue-600 place-content-center place-items-center flex outline-offset-2 shadow-md shadow-blue-400",
					{
						"bg-blue-400 stroke-white text-white shadow-md": relevancy === "primary",
						"bg-stone-200 stroke-blue-500 text-blue-500 shadow-md hover:stroke-white hover:text-white": relevancy === "secondary",
						"bg-transparent stroke-stone-500 text-stone-500 hover:stroke-white hover:text-white shadow-sm": relevancy === 'ghost',
					},
				)}
			>
				{children}
			</button>
		);
	},
);
