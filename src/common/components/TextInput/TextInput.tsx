import { EditorContent, useEditor } from "@tiptap/react";
import { getExtensions } from "./TextInput.config";
import "./TextInput.css";
import { parseSpark } from "../../../scripts/utils/stringUtils";
import { isUserSelectingTag } from "./TagList/TagList";
import { isUserSelectingExtension } from "./SparkExtensionList/SparkExtensionList";
import { useEffect } from "react";

export type TextInputProps = {
	onSubmit?: (plainText: string, html: string) => void;
	parentWindow?: Window;
	allowAddingTags?: boolean;
	enableTags?: boolean;
	enableExtension?: boolean;
	onChange?: (htmlString: string) => void;
	style?: keyof typeof styleMap;
	placeholder?: string;
	content?: string;
	onEscape?: () => void;
	globalAccessorId?: string;
};

const styleMap = {
	spark: "p-4 min-h-full block w-full bg-white border border-blue-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600",
	search: "px-4 py-2 block w-full bg-transparent text-sm hover:bg-white focus:bg-white border-b border-b-stone-200 rounded",
	invisible:
		"p-1 w-full bg-transparent rounded-sm text-stone-500 focus:text-stone-700 text-sm max-w-72",
};

export const TextInput = (props: TextInputProps) => {
	const {
		onSubmit,
		parentWindow,
		allowAddingTags = true,
		onChange,
		style = "spark",
		content,
		placeholder,
		enableTags,
		enableExtension,
		onEscape,
		globalAccessorId,
	} = props;
	const editor = useEditor(
		{
			content,
			extensions: getExtensions({
				parentWindow: parentWindow ?? window,
				allowAddingTags,
				placeholder,
				enableTags,
				enableExtension,
			}),
			editorProps: {
				attributes: {
					"aria-label": "Add a spark",
					role: "textbox",
					class: `${styleMap[style]}`,
				},
				handleKeyDown: (_view, event) => {
					if (!onSubmit) {
						return false;
					}
					if (isUserSelectingTag || isUserSelectingExtension) {
						// user currently has the selection open and might have pressed enter to select an item
						return false;
					}
					if (event.key !== "Enter" || event.shiftKey) {
						if (event.key === "Escape") {
							onEscape?.();
						}
						return false;
					}
					const html = editor?.getHTML().trim() ?? "";
					const plainText = editor?.getText().trim() ?? "";
					if (html === "") {
						return false;
					}
					onSubmit(plainText, html);
					const { prefixTagsHtml } = parseSpark(plainText, html);
					editor?.commands.setContent(prefixTagsHtml, false, {
						preserveWhitespace: true,
					});
					return true;
				},
			},
			onUpdate: ({ editor }) => {
				onChange?.(editor.getHTML());
			},
		},
		[content],
	);

	useEffect(() => {
		if (!globalAccessorId) {
			return;
		}
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const win = window as any;
		if (!win.editor) {
			win.editor = {};
		}
		win.editor[globalAccessorId] = editor;
	}, [editor, globalAccessorId]);

	return (
		<EditorContent
			editor={editor}
			className="h-full"
		/>
	);
};
