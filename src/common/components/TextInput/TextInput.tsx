import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import { extensions } from "./TextInput.config";
import "./TextInput.css";
import { extractTags } from "../../../scripts/utils/stringUtils";

export type TextInputProps = {
	onSubmit?: (plainText: string, html: string) => void;
};

let editor: Editor | null = null;

export const TextInput = (props: TextInputProps) => {
	const { onSubmit } = props;
	editor = useEditor({
		extensions: extensions,
		editorProps: {
			attributes: {
				"aria-label": "Add a spark",
				class: "p-4 min-h-full block w-full bg-white border border-blue-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600",
			},
			handleKeyDown: (view, event) => {
				if (!onSubmit) {
					return false;
				}
				if (event.key !== "Enter" || event.shiftKey) {
					return false;
				}
				const html = editor?.getHTML().trim() ?? "";
				const plainText = editor?.getText().trim() ?? "";
				if (html === "") {
					return false;
				}
				onSubmit(plainText, html);
				const [prefixTags] = extractTags(plainText);
				editor?.commands.setContent(`${prefixTags.join(" ")} `, false, {
					preserveWhitespace: true,
				});
				return true;
			},
		},
	});

	return (
		<EditorContent
			editor={editor}
			className="h-full"
		/>
	);
};