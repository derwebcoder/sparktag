import { useState } from "react";
import { sparkService } from "../../scripts/db/SparkService";
import { TextInput } from "../../common/components/TextInput/TextInput";
import { ArrowRightStartOnBox } from "../../assets/icons/ArrowRightStartOnBox";
import { ArrowRightEndOnBox } from "../../assets/icons/ArrowRightEndOnBox";
import { createPortal } from "react-dom";
import { IconButton } from "../../common/components/IconButton/IconButton";

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
			width: 300,
			height: 150,
		});
		if (!pip) {
			return;
		}

		pip.addEventListener("pagehide", (_event) => {
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

		// This does not seem to work, but let's keep it. Maybe it will in the future.
		const themeColor = document.createElement("meta");
		themeColor.name = "theme-color";
		themeColor.content = "#2563eb";
		pip.document.head.append(themeColor);

		setPipWindow(pip);
	};

	const renderApp = () => {
		// setAttachedTo("app");
		pipWindow?.close();
	};

	return (
		<>
			<div className="flex flex-col gap-1">
				<div className="min-h-32">
					<TextInput
						onSubmit={handleSubmit}
						parentWindow={window}
					/>
				</div>
				<div className="flex justify-end px-3">
					<IconButton
						type="button"
						onClick={renderPIP}
						title="detach"
					>
						<ArrowRightStartOnBox />
					</IconButton>
				</div>
			</div>
			{pipWindow &&
				createPortal(
					<div className="grid grid-rows-[1fr_min-content] gap-1 h-full p-1">
						<div className="min-h-full overflow-y-auto">
							<TextInput
								onSubmit={handleSubmit}
								parentWindow={pipWindow}
							/>
						</div>
						<div className="flex justify-end px-3">
							<IconButton
								type="button"
								onClick={renderApp}
								title="attach"
							>
								<ArrowRightEndOnBox />
							</IconButton>
						</div>
					</div>,
					pipWindow.document.body,
				)}
		</>
	);
};
