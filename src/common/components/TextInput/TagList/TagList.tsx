import type { MentionNodeAttrs } from "@tiptap/extension-mention";
import type {
	SuggestionKeyDownProps,
	SuggestionProps,
} from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

export const NEW_TAG_PREFIX = 'New tag "';
export const getNewTagPhrase = (tag: string) =>
	`${NEW_TAG_PREFIX}${tag.toLowerCase()}"`;

export let isUserSelectingTag = false;

type Props = SuggestionProps<{ name: string; hue: number }, MentionNodeAttrs>;

export type TagListRef = {
	onKeyDown: (data: SuggestionKeyDownProps) => boolean;
};

export const TagList = forwardRef<TagListRef, Props>((props, ref) => {
	const { items } = props;
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

	const upHandler = () => {
		setSelectedIndex((selectedIndex + items.length - 1) % items.length);
	};

	const downHandler = () => {
		setSelectedIndex((selectedIndex + 1) % items.length);
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
		<div className="bg-white border border-stone-400 rounded-md shadow flex flex-col gap-1 scroll-auto px-3 py-2 relative">
			{items.length ? (
				items.map((item, index) => (
					<button
						type="button"
						className={`flex gap-1 text-left py-1 px-3 rounded-md ${index === selectedIndex ? "bg-stone-300" : "hover:bg-stone-200"}`}
						key={item.name}
						data-key={item.name}
						onClick={() => selectItem(index)}
					>
						<span
							className="tag"
							style={
								{
									"--tag-color": `${item.hue}`,
								} as React.CSSProperties
							}
						>
							{item.name}
						</span>
					</button>
				))
			) : (
				<div className="item">No result</div>
			)}
		</div>
	);
});
