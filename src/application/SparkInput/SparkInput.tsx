import { sparkService } from "../../scripts/db/SparkService";
import { TextInput } from "../../ui/components/TextInput/TextInput";

export const SparkInput = () => {
	const handleSubmit = (plainText: string, html: string) => {
		sparkService.addSpark(plainText, html);
	};

	return <TextInput onSubmit={handleSubmit} />;
};
