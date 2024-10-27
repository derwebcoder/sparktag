import { XIcon } from "../../assets/icons/XIcon";
import { IconButton } from "../../common/components/IconButton/IconButton";
import { Button } from "../../common/components/shadcn/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../../common/components/shadcn/drawer";
import { TagIcon } from "../../assets/icons/TagIcon";
import { useLiveQuery } from "dexie-react-hooks";
import { tagService } from "../../scripts/db/TagService";
import { TagConfig } from "./TagConfig/TagConfig";

export const TagEditor = () => {
	const tags = useLiveQuery(() => {
		return tagService.listTags();
	});

	return (
		<>
			<Drawer>
				<DrawerTrigger asChild>
					<IconButton
						type="button"
						aria-label="Open the tag editor"
						relevancy="secondary"
					>
						<TagIcon />
					</IconButton>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mx-auto max-w-md">
						<DrawerHeader className="flex flex-row justify-between place-items-center">
							<DrawerTitle>Tag Editor</DrawerTitle>
							<DrawerClose asChild>
								<Button
									variant="ghost"
									size="icon"
								>
									<XIcon />
								</Button>
							</DrawerClose>
						</DrawerHeader>
					</div>
					<div className="grid grid-cols-[1fr_minmax(400px,_900px)_1fr] gap-4 pb-10 overflow-y-auto max-h-96">
						{!tags || tags.length <= 0 ? (
							<div>No tags yet.</div>
						) : (
							<div className="col-start-2 grid grid-cols-[200px_1fr_180px_100px_100px]">
								{tags.map((tag) => (
									<TagConfig
										key={tag.name}
										tag={tag}
									/>
								))}
							</div>
						)}
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
};
