import type React from "react";
import { useId } from "react";
import { KeyIcon } from "../../icons/KeyIcon";

import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

export type InputProps<FORMDATA extends FieldValues> =
	React.InputHTMLAttributes<HTMLInputElement> & {
		id: string;
		label: string;
		name: Path<FORMDATA>;
		register: UseFormRegister<FORMDATA>;
		required?: boolean;
		iconSlot?: React.ReactNode;
	};

export const Input = <FORMDATA extends FieldValues>(
	props: InputProps<FORMDATA>,
) => {
	const {
		id,
		label,
		register,
		required,
		name,
		iconSlot,
		...inputAttributes
	} = props;
	return (
		<div className="w-full">
			<label
				htmlFor={id}
				className="block text-sm font-medium mb-2 dark:text-white ps-2"
			>
				{label}
			</label>
			<div className="flex gap-3 py-3 px-4 border w-full border-gray-200 rounded-lg text-sm focus-within:border-blue-500 focus-within:ring-blue-500 has-[:disabled]:opacity-50 has-[:disabled]:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus-within:ring-neutral-600">
				{iconSlot}
				<input
					type="text"
					id={id}
					className="w-full focus-visible:outline-0 border-0 inline p-0 focus:outline-0 focus:[box-shadow:unset] focus:border-0"
					{...inputAttributes}
					{...register(name, { required })}
				/>
			</div>
		</div>
	);
};
