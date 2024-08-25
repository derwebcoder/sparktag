import { KeyIcon } from "../../icons/KeyIcon";

import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

export type PasswordInputProps<FORMDATA extends FieldValues> = {
	label: string;
	name: Path<FORMDATA>;
	register: UseFormRegister<FORMDATA>;
	required: boolean;
	placeholder?: string;
};

export const PasswordInput = <FORMDATA extends FieldValues>(
	props: PasswordInputProps<FORMDATA>,
) => {
	const { label, register, required, name, placeholder } = props;
	return (
		<label className="form-control w-full">
			<div className="label">
				<span className="label-text">{label}</span>
			</div>
			<div className="input input-bordered flex items-center gap-2 shadow-inner w-full bg-white">
				<KeyIcon className="stroke-neutral" />
				<input
					type="password"
					{...register(name, { required })}
					placeholder={placeholder}
					className="w-full "
				/>
			</div>
		</label>
	);
};
