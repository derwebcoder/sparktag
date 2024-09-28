import logo from "@/assets/images/logo.png";
import { Settings } from "../Settings/Settings";

export const MainMenu = () => {
	return (
		<div className="flex flex-col gap-4 place-items-center">
			<img
				src={logo.src}
				className="size-10"
				alt="Logo of Sparktag. A white S letter in a blue circle."
			/>
			<Settings />
		</div>
	);
};
