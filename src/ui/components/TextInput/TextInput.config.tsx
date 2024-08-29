import ListKeymap from "@tiptap/extension-list-keymap";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

export const extensions = [
	StarterKit.configure({
		paragraph: {
			HTMLAttributes: {
				class: "text-gray-800 dark:text-neutral-200",
			},
		},
		bold: {
			HTMLAttributes: {
				class: "font-bold",
			},
		},
		bulletList: {
			HTMLAttributes: {
				class: "list-disc list-inside text-gray-800 dark:text-white",
			},
		},
		orderedList: {
			HTMLAttributes: {
				class: "list-decimal list-inside text-gray-800 dark:text-white",
			},
		},
		blockquote: {
			HTMLAttributes: {
				class: "text-gray-800 sm:text-xl dark:text-white",
			},
		},
	}),
	Placeholder.configure({
		placeholder: "Add a message, if you'd like.",
		emptyNodeClass: "text-gray-400 dark:text-neutral-200",
	}),
	ListKeymap,
];
