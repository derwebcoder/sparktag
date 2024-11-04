import logo from "@/assets/images/logo.png";
import { IconButton } from "@/common/components/IconButton/IconButton";
import { HomeIcon } from "@/assets/icons/HomeIcon";
import { ListTodoIcon } from "@/assets/icons/ListTodoIcon";
import { GraduationCapIcon } from "@/assets/icons/GraduationCapIcon";

export const AppMenu = () => {
	return (
		<div className="flex flex-row gap-4 place-items-center h-10">
			<IconButton
				type="button"
				onClick={() => console.log('yeah')}
				title="home"
				relevancy="secondary"
			>
				<HomeIcon />
			</IconButton>
			<IconButton
				type="button"
				onClick={() => console.log('yeah')}
				title="home"
				relevancy="secondary"
			>
				<ListTodoIcon />
			</IconButton>
			<IconButton
				type="button"
				onClick={() => console.log('yeah')}
				title="home"
				relevancy="secondary"
			>
				<GraduationCapIcon />
			</IconButton>
		</div>
	);
};
