import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import { getExtensions } from "./TextInput.config";
import "./TextInput.css";
import { parseSpark } from "../../../scripts/utils/stringUtils";
import { isUserSelectingTag } from "./TagList/TagList";
import { isUserSelectingExtension } from "./SparkExtensionList/SparkExtensionList";

export type TextInputProps = {
	onSubmit?: (plainText: string, html: string) => void;
	parentWindow?: Window;
	allowAddingTags?: boolean;
	onChange?: (htmlString: string) => void;
	style?: keyof typeof styleMap;
	placeholder?: string;
};

let editor: Editor | null = null;

const styleMap = {
	spark: "p-4 min-h-full block w-full bg-white border border-blue-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600",
	search: "px-4 py-2 block w-full bg-transparent hover:bg-white focus:bg-white border-b border-b-stone-200 rounded",
};

export const TextInput = (props: TextInputProps) => {
	const {
		onSubmit,
		parentWindow,
		allowAddingTags = true,
		onChange,
		style = "spark",
		placeholder,
	} = props;
	editor = useEditor({
		extensions: getExtensions({
			parentWindow: parentWindow ?? window,
			allowAddingTags,
			placeholder,
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
				if (event.key !== "Enter" || event.shiftKey) {
					return false;
				}
				if (isUserSelectingTag || isUserSelectingExtension) {
					// user currently has the selection open and might have pressed enter to select an item
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
	});

	return (
		<EditorContent
			editor={editor}
			className="h-full"
		/>
	);
};
