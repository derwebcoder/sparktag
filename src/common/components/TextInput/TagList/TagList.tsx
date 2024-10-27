import type { MentionNodeAttrs } from "@tiptap/extension-mention";
import type {
	SuggestionKeyDownProps,
	SuggestionProps,
} from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Tag } from "../../Tag/Tag";
import type { PlainTag } from "../../../../interfaces/Tag";

export const NEW_TAG_PREFIX = 'New tag "';
export const getNewTagPhrase = (tag: string) =>
	`${NEW_TAG_PREFIX}${tag.toLowerCase()}"`;

export let isUserSelectingTag = false;

export type TagListProps = SuggestionProps<PlainTag, MentionNodeAttrs> & {
	parentWindow: Window;
};

export type TagListRef = {
	onKeyDown: (data: SuggestionKeyDownProps) => boolean;
};

export const TagList = forwardRef<TagListRef, TagListProps>((props, ref) => {
	const { items, parentWindow } = props;
	const [selectedIndex, setSelectedIndex] = useState(1);

	useEffect(() => {
		isUserSelectingTag = true;

		return () => {
			isUserSelectingTag = false;
		};
	}, []);

	const selectItem = (index: number) => {
		const item = items[index];
		if (!item) {
			return;
		}
		let itemName = item.name;
		if (itemName.startsWith(NEW_TAG_PREFIX)) {
			itemName = itemName.slice(
				NEW_TAG_PREFIX.length,
				itemName.length - 1,
			);
		}

		if (itemName) {
			props.command({ id: itemName.toLowerCase() });
			props.editor;
		}
	};

	const scrollIntoView = (index: number) => {
		const itemElement = parentWindow.document.querySelector(
			`[data-selector=tags-dropdown]>:nth-child(${index + 1})`,
		);
		itemElement?.scrollIntoView({
			block: "nearest",
		});
	};

	const upHandler = () => {
		const nextIndex = (selectedIndex + items.length - 1) % items.length;
		setSelectedIndex(nextIndex);
		scrollIntoView(nextIndex);
	};

	const downHandler = () => {
		const nextIndex = (selectedIndex + 1) % items.length;
		setSelectedIndex(nextIndex);
		scrollIntoView(nextIndex);
	};

	const enterHandler = () => {
		selectItem(selectedIndex);
	};

	useEffect(() => {
		if (items.length <= 1 || !items[0].name.startsWith(NEW_TAG_PREFIX)) {
			setSelectedIndex(0);
			return;
		}
		setSelectedIndex(1);
	}, [items]);

	useImperativeHandle(ref, () => ({
		onKeyDown: ({ event }) => {
			if (event.key === "ArrowUp") {
				upHandler();
				return true;
			}

			if (event.key === "ArrowDown") {
				downHandler();
				return true;
			}

			if (event.key === "Enter" || event.key === " ") {
				enterHandler();
				event.preventDefault();
				event.stopPropagation();
				return true;
			}

			return false;
		},
	}));

	return (
		<div
			data-selector="tags-dropdown"
			className="bg-white border border-stone-400 rounded-md shadow flex flex-col gap-1 scroll-auto px-3 py-2 relative overflow-y-auto max-h-64"
		>
			{items.length ? (
				items.map((item, index) => (
					<button
						type="button"
						className={`flex flex-col gap-1 text-left py-1 px-3 rounded-md ${index === selectedIndex ? "bg-stone-300" : "hover:bg-stone-200"}`}
						key={item.name}
						title={item.name}
						onClick={() => selectItem(index)}
					>
						<Tag
							name={item.name}
							hue={item.hue}
							icon={item.icon}
						/>
						<div
							className="text-sm text-stone-500 px-2 max-h-10 overflow-hidden text-clip"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: it's html entered by the user in the TextInput, they get what they deserve
							dangerouslySetInnerHTML={{
								__html: item.description ?? "",
							}}
						/>
					</button>
				))
			) : (
				<div className="item">No result</div>
			)}
		</div>
	);
});
