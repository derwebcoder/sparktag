import type { StringValidation } from "astro/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { authenticate } from "../scripts/auth/secret";
import { Form } from "../ui/components/Form/Form";
import { PasswordInput } from "../ui/components/PasswordInput/PasswordInput";

interface FormValues {
	secret: string;
}

export const LoginForm = () => {
	const { register, handleSubmit } = useForm<FormValues>();

	const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
		e?.preventDefault();
		try {
			await authenticate(data.secret);
		} catch (e) {
			console.error("That was wrong.");
			return;
		}
		alert("You are in!");
	};

	return (
		<div>
			<Form
				onSubmit={handleSubmit(onSubmit)}
				submitText="Get in now"
			>
				<PasswordInput
					label="What is the secret?"
					name="secret"
					register={register}
					required
				/>
			</Form>
		</div>
	);
};
