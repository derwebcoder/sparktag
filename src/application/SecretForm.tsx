import { type SubmitHandler, useForm } from "react-hook-form";
import { authenticate } from "../scripts/auth/secret";
import { FormContainer } from "../ui/components/FormContainer/FormContainer";
import { Input } from "../ui/components/Input/Input";
import { KeyIcon } from "../ui/icons/KeyIcon";

interface FormValues {
	secret: string;
}

export const SecretForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<FormValues>();

	const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
		e?.preventDefault();
		try {
			await authenticate(data.secret);
			window.location.href = import.meta.env.BASE_URL;
		} catch (e) {
			setError("secret", { message: "😢 Sadly that is not correct." });
			console.error("That was wrong.");
			return;
		}
	};

	return (
		<div>
			<FormContainer
				onSubmit={handleSubmit(onSubmit)}
				title="Are you part of the closed beta user group?"
				subtitle="Your journey starts here."
				submitText="Get in now"
			>
				<Input
					id="secret-input"
					iconSlot={<KeyIcon />}
					label="What is the secret?"
					name="secret"
					register={register}
					required
					type="password"
					aria-invalid={errors.secret ? "true" : "false"}
				/>
				{errors.secret && (
					<span
						role="alert"
						className="w-full text-center"
					>
						{errors.secret.message}
					</span>
				)}
			</FormContainer>
		</div>
	);
};
