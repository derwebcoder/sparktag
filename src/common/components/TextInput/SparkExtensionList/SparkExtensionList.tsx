import type { MentionNodeAttrs } from "@tiptap/extension-mention";
import type {
	SuggestionKeyDownProps,
	SuggestionProps,
} from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

export const NEW_TAG_PREFIX = 'New tag "';
export const getNewTagPhrase = (tag: string) =>
	`${NEW_TAG_PREFIX}${tag.toLowerCase()}"`;

export let isUserSelectingExtension = false;

type Props = SuggestionProps<string, MentionNodeAttrs>;

export type SparkExtensionListRef = {
	onKeyDown: (data: SuggestionKeyDownProps) => boolean;
};

export const SparkExtensionList = forwardRef<SparkExtensionListRef, Props>(
	(props, ref) => {
		const { items } = props;
		const [selectedIndex, setSelectedIndex] = useState(1);

		useEffect(() => {
			isUserSelectingExtension = true;

			return () => {
				isUserSelectingExtension = false;
			};
		}, []);

		const selectItem = (index: number) => {
			const item = items[index];
			if (!item) {
				return;
			}

			if (item) {
				props.command({ id: item });
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

		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
			setSelectedIndex(0);
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
							key={item}
							data-key={item}
							onClick={() => selectItem(index)}
						>
							<span>{item}</span>
						</button>
					))
				) : (
					<div className="item">No result</div>
				)}
			</div>
		);
	},
);
