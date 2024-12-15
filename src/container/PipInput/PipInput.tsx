import { useState } from "react";
import { IconButton } from "../../common/components/IconButton/IconButton";
import { ArrowRightStartOnBox } from "../../assets/icons/ArrowRightStartOnBox";
import { createPortal } from "react-dom";
import { TextInput } from "../../common/components/TextInput/TextInput";
import { sparkService } from "../../scripts/db/SparkService";

export const PipInput = () => {
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

		pip.document.documentElement.style.height = "100%";
		pip.document.body.className = window.document.body.className;

		// This does not seem to work, but let's keep it. Maybe it will in the future.
		const themeColor = document.createElement("meta");
		themeColor.name = "theme-color";
		themeColor.content = "#2563eb";
		pip.document.head.append(themeColor);

		setPipWindow(pip);
	};

	return (
		<>
			<div className="flex justify-end px-3">
				<IconButton
					type="button"
					onClick={renderPIP}
					title="detach"
					relevancy="ghost"
				>
					<ArrowRightStartOnBox />
				</IconButton>
			</div>
			{pipWindow &&
				createPortal(
					<div className="grid grid-rows-[1fr_min-content] gap-1 h-full p-1">
						<div className="min-h-full overflow-y-auto">
							<TextInput
								onSubmit={handleSubmit}
								parentWindow={pipWindow}
								placeholder={"Your next spark ..."}
							/>
						</div>
					</div>,
					pipWindow.document.body,
				)}
		</>
	);
};
