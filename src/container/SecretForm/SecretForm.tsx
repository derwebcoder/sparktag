import { type SubmitHandler, useForm } from "react-hook-form";
import { authenticate } from "../../scripts/auth/secret";
import { FormContainer } from "../../common/components/FormContainer/FormContainer";
import { Input } from "../../common/components/Input/Input";
import { KeyIcon } from "../../assets/icons/KeyIcon";
import { useHydratedFlag } from "../../scripts/hydratedStore";

interface FormValues {
	secret: string;
}

export const SecretForm = () => {
	const isHydrated = useHydratedFlag();
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
			window.location.replace(import.meta.env.BASE_URL);
		} catch (e) {
			setError("secret", { message: "😢 Sadly that is not correct." });
			return;
		}
	};

	return (
		<div data-secretform={isHydrated ? "hydrated" : "static"}>
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
					aria-describedby={
						errors.secret ? "secret-error" : undefined
					}
				/>
				{errors.secret && (
					<span
						id="secret-error"
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
