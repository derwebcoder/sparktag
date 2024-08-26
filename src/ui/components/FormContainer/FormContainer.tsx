import type { FormEventHandler } from "react";

export type FormContainerProps = {
	title: string;
	subtitle: string;
	onSubmit: FormEventHandler<HTMLFormElement>;
	children: React.ReactNode;
	submitText?: string;
};

export const FormContainer = (props: FormContainerProps) => {
	const { title, subtitle, onSubmit, children, submitText } = props;

	return (
		<div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-900 dark:border-neutral-700">
			<div className="p-4 sm:p-7">
				<div className="text-center">
					<span className="block text-2xl font-bold text-gray-800 dark:text-white">
						{title}
					</span>
					<p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
						{subtitle}
					</p>
				</div>

				<div className="mt-5">
					<form onSubmit={onSubmit}>
						<div className="grid gap-y-4">
							{children}

							<button
								type="submit"
								className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
							>
								{submitText ?? "Submit"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
