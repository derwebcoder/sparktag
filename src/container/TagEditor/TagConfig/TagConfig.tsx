import { tagIcons, type Tag, type TagIcon } from "../../../interfaces/Tag";
import { Tag as TagElement } from "../../../common/components/Tag/Tag";
import { useEffect, useState } from "react";
import { HueSlider } from "../../../common/components/HueSlider/HueSlider";
import { tagService } from "../../../scripts/db/TagService";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../../common/components/shadcn/popover";
import { Button } from "../../../common/components/shadcn/button";
import { debounce } from "../../../scripts/utils/debounce";
import { TextInput } from "../../../common/components/TextInput/TextInput";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../common/components/shadcn/select";
import "./TagConfig.css";
import { IconButton } from "../../../common/components/IconButton/IconButton";
import { TrashIcon } from "../../../assets/icons/TrashIcon";
import { sparkService } from "../../../scripts/db/SparkService";
import { useToast } from "../../../common/hooks/use-toast";
import { ToastAction } from "../../../common/components/shadcn/toast";
import { SearchInputEditorAccessorId } from "../../SearchInput/SearchInput";
import type { Editor } from "@tiptap/react";

type Props = {
	tag: Tag;
	showUsageCount: boolean;
};

const updateHueDebounced = debounce((name: string, hue: number) => {
	tagService.updateHue(name, hue);
}, 500);

const updateDescriptionDebounced = debounce(
	(name: string, description: string) => {
		tagService.updateDescription(name, description);
	},
	1000,
);

const updateIconDebounced = debounce((name: string, icon: TagIcon) => {
	tagService.updateIcon(name, icon);
}, 1000);

export const TagConfig = (props: Props) => {
	const { tag, showUsageCount } = props;
	const [hue, setHue] = useState(tag.hue);
	const [icon, setIcon] = useState<TagIcon>(tag.icon ?? "hash");
	const { toast } = useToast();
	const [usageCount, setUsageCount] = useState(0);

	useEffect(() => {
		if (!showUsageCount) {
			return;
		}
		(async () => {
			setUsageCount((await sparkService.find([tag.name])).length);
		})();
	}, [showUsageCount, tag.name]);

	const handleHueChange = (value: number) => {
		setHue(value);
		updateHueDebounced(tag.name, value);
	};

	const searchTag = () => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const searchEditor: Editor | undefined = (window as any).editor?.[
			SearchInputEditorAccessorId
		];

		if (!searchEditor) {
			return;
		}

		searchEditor.commands.setContent(
			`
			<span
				data-type="tags"
				data-icon="${tag.icon}"
				data-id="${tag.name}"
				style="--tag-color: ${tag.hue}"
				class="tag"
				contenteditable="false"
			>${tag.name}</span>
		`,
			true,
			{ preserveWhitespace: false },
		);
	};

	const handleDelete = async () => {
		const sparksWithTag = await sparkService.find([tag.name]);

		if (sparksWithTag.length > 0) {
			toast({
				title: `Could not delete tag "${tag.name}"`,
				description: `The tag is still being used by ${sparksWithTag.length} sparks. Edit these sparks and remove the tag on each of them to delete this tag.`,
				variant: "destructive",
				action: (
					<ToastAction
						altText="View sparks using this tag"
						onClick={searchTag}
					>
						View
					</ToastAction>
				),
			});
			return;
		}

		await tagService.deleteTag(tag.name);
	};

	return (
		<div className="grid grid-cols-subgrid col-span-6 border-b border-stone-200 py-2 w-full items-center gap-4">
			<div>{showUsageCount ? usageCount : ""}</div>
			<div className="justify-self-center">
				<TagElement
					name={tag.name}
					hue={hue}
					icon={icon}
				/>
			</div>
			<div>
				<TextInput
					enableTags={false}
					enableExtension={false}
					placeholder="Add a description"
					content={tag.description}
					style="invisible"
					onChange={(html) =>
						updateDescriptionDebounced(tag.name, html)
					}
				/>
			</div>
			<div>
				<Select
					defaultValue={icon}
					onValueChange={(value: TagIcon) => {
						setIcon(value);
						updateIconDebounced(tag.name, value);
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder={"Select an icon"} />
					</SelectTrigger>
					<SelectContent>
						{tagIcons.map((icon) => {
							return (
								<SelectItem
									key={icon}
									value={icon}
								>
									<div
										data-icon={icon}
										className="icon-preview"
									>
										{icon}
									</div>
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</div>
			<div>
				<Popover modal={true}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							className="flex gap-1"
						>
							<div
								className="w-3 h-3"
								style={{
									background: `hsl(${hue} 50% 70% / 100%)`,
								}}
							/>{" "}
							Color
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<HueSlider
							hue={hue}
							onChange={handleHueChange}
						/>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex flex-row justify-center">
				<IconButton
					relevancy="secondary"
					onClick={handleDelete}
				>
					<TrashIcon />
				</IconButton>
			</div>
		</div>
	);
};
