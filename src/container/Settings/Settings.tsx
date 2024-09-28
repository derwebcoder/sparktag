import { CogIcon } from "../../assets/icons/CogIcon";
import { IconButton } from "../../common/components/IconButton/IconButton";
import {
	Drawer,
	DrawerContent,
	DrawerTrigger,
} from "../../common/components/ui/drawer";

export const Settings = () => {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<IconButton
					type="button"
					aria-label="Open the settings"
					relevancy="secondary"
				>
					<CogIcon />
				</IconButton>
			</DrawerTrigger>
			<DrawerContent>Hello world</DrawerContent>
		</Drawer>
	);
};
