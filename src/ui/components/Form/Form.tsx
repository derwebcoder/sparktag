import type { FormEventHandler } from "react";

export type FormProps = {
	onSubmit: FormEventHandler<HTMLFormElement>;
	children: React.ReactNode;
	submitText?: string;
};

export const Form = (props: FormProps) => {
	const { onSubmit, children, submitText } = props;

	return (
		<form
			onSubmit={onSubmit}
			className="flex flex-col gap-4"
		>
			<div className="flex flex-col gap-4">{children}</div>
			<div className="flex justify-end">
				<button
					type="submit"
					className="btn btn-primary w-full"
				>
					{submitText ?? "Submit"}
				</button>
			</div>
		</form>
	);
};
