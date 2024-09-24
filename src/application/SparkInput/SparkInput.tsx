import { useRef, useState } from "react";
import { sparkService } from "../../scripts/db/SparkService";
import { TextInput } from "../../ui/components/TextInput/TextInput";
import { ArrowRightStartOnBox } from "../../ui/icons/ArrowRightStartOnBox";
import { ArrowRightEndOnBox } from "../../ui/icons/ArrowRightEndOnBox";

export const SparkInput = () => {
	const ref = useRef(null);
	const [attachedTo, setAttachedTo] = useState<"app" | "pip">("app");
	const handleSubmit = (plainText: string, html: string) => {
		sparkService.addSpark(plainText, html);
	};

	const renderPIP = async () => {
		if (!ref.current) {
			return;
		}

		if (window.documentPictureInPicture?.window) {
			console.log("return");
			return;
		}

		const pipWindow = await window.documentPictureInPicture?.requestWindow({
			width: 500,
			height: 250,
		});
		if (!pipWindow) {
			return;
		}

		pipWindow.document.body.append(ref.current);
		setAttachedTo("pip");
	};

	const renderApp = () => {
		setAttachedTo("app");
	};

	return (
		<div
			ref={ref}
			className="flex flex-col gap-2"
		>
			<TextInput onSubmit={handleSubmit} />
			<div className="flex justify-end px-3">
				{attachedTo === "app" ? (
					<button
						type="button"
						onClick={renderPIP}
						title="detach"
					>
						<ArrowRightStartOnBox />
					</button>
				) : (
					<button
						type="button"
						onClick={renderApp}
						title="attach"
					>
						<ArrowRightEndOnBox />
					</button>
				)}
			</div>
		</div>
	);
};
