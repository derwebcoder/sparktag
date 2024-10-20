import { sparkService } from "../../scripts/db/SparkService";
import { TextInput } from "../../common/components/TextInput/TextInput";

export const SparkInput = () => {
	const handleSubmit = (plainText: string, html: string) => {
		sparkService.addSpark(plainText, html);
	};

	return (
		<>
			<div className="flex flex-col gap-1">
				<div className="min-h-32">
					<TextInput
						onSubmit={handleSubmit}
						parentWindow={window}
						placeholder={"Your next spark ..."}
					/>
				</div>
			</div>
		</>
	);
};
