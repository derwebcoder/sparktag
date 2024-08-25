import { KeyIcon } from "../../icons/KeyIcon";

import type { FieldValues, UseFormRegister } from "react-hook-form";

export type PasswordInputProps = {
  label: string;
  register: UseFormRegister<FieldValues>;
  required: boolean;
};

export const PasswordInput = (props: PasswordInputProps) => {
  const { label, register, required } = props;
  return (
    <div>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <div className="input input-bordered flex items-center gap-2">
          <KeyIcon />
          <input
            type="password"
            {...register(label, { required })}
            placeholder="Enter the secret ..."
          />
        </div>
      </label>
    </div>
  );
};
