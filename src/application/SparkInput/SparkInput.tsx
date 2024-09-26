import { useRef, useState } from "react";
import { sparkService } from "../../scripts/db/SparkService";
import { TextInput } from "../../ui/components/TextInput/TextInput";
import { ArrowRightStartOnBox } from "../../ui/icons/ArrowRightStartOnBox";
import { ArrowRightEndOnBox } from "../../ui/icons/ArrowRightEndOnBox";
import { createPortal } from "react-dom";

export const SparkInput = () => {
	const [pipWindow, setPipWindow] = useState<Window | undefined>();
	const handleSubmit = (plainText: string, html: string) => {
		sparkService.addSpark(plainText, html);
	};

	const renderPIP = async () => {
		if (window.documentPictureInPicture?.window) {
			console.log("return");
			return;
		}

		const pip = await window.documentPictureInPicture?.requestWindow({
			width: 500,
			height: 250,
		});
		if (!pip) {
			return;
		}

		pip.addEventListener("pagehide", (event) => {
			setPipWindow(undefined);
		});

		// copy all existing styles because without would be boring
		const allStyles = [...document.styleSheets];
		for (const styles of allStyles) {
			try {
				const stylesheet = [...styles.cssRules]
					.map((rule) => rule.cssText)
					.join(" ");
				const style = document.createElement("style");
				style.textContent = stylesheet;
				pip.document.head.appendChild(style);
			} catch (e) {
				if (!styles.href) {
					continue;
				}
				const link = document.createElement("link");
				link.rel = "stylesheet";
				link.type = styles.type;
				link.media = styles.media.toString();
				link.href = styles.href;
				pip.document.head.appendChild(link);
			}
		}

		setPipWindow(pip);
	};

	const renderApp = () => {
		// setAttachedTo("app");
		pipWindow?.close();
	};

	return (
		<>
			<div className="flex flex-col gap-2">
				<div className="min-h-32">
					<TextInput onSubmit={handleSubmit} />
				</div>
				<div className="flex justify-end px-3">
					<button
						type="button"
						onClick={renderPIP}
						title="detach"
					>
						<ArrowRightStartOnBox />
					</button>
				</div>
			</div>
			{pipWindow &&
				createPortal(
					<div className="grid grid-rows-[1fr_min-content] gap-2 h-full p-1">
						<div className="min-h-full overflow-y-auto">
							<TextInput onSubmit={handleSubmit} />
						</div>
						<div className="flex justify-end px-3">
							<button
								type="button"
								onClick={renderApp}
								title="attach"
							>
								<ArrowRightEndOnBox />
							</button>
						</div>
					</div>,
					pipWindow.document.body,
				)}
		</>
	);
};
