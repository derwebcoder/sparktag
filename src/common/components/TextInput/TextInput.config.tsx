import ListKeymap from "@tiptap/extension-list-keymap";
import Placeholder from "@tiptap/extension-placeholder";
// import Document from "@tiptap/extension-document";
// import Text from "@tiptap/extension-text";
// import Paragraph from "@tiptap/extension-paragraph";
import Mention from "@tiptap/extension-mention";
import StarterKit from "@tiptap/starter-kit";

import { mergeAttributes, ReactRenderer } from "@tiptap/react";
import { getNewTagPhrase, TagList, type TagListRef } from "./TagList/TagList";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import { stringToHue } from "../../../scripts/utils/stringUtils";
import { tagService } from "../../../scripts/db/TagService";

export const getExtensions = (parentWindow: Window) => [
	// Document,
	// Text,
	// Paragraph,
	StarterKit.configure({
		// for now disabling this as it's interfering with the "#" logic of the Mention
		// plugin when a user types "#" at the beginning of a line and presses enter.
		// There might be a solution of extending the Heading plugin and overriding the addInputRules
		// like here: https://github.com/ueberdosis/tiptap/issues/632#issuecomment-600536493
		// but I did not figure out why the Mention plugin adds a space after the # in the first place ...
		heading: false,
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
	ListKeymap,
	Mention.configure({
		HTMLAttributes: {
			class: "tag",
		},
		renderHTML({ options, node }) {
			return [
				"span",
				mergeAttributes(
					{
						style: `--tag-color: ${stringToHue(`#${node.attrs.id}`)}`,
						// this is sadly not working because it's async - don't have a good idea yet how to make this work
						// style: `--tag-color: ${await tagService.getTagHue(node.attrs.id)}`,
					},
					options.HTMLAttributes,
				),
				`${options.suggestion.char}${node.attrs.id}`,
			];
		},
		suggestion: {
			items: async ({ query }) => {
				const tags = await tagService.find(query, 5);

				if (query.length <= 0) {
					return tags;
				}

				if (tags.length === 1 && tags[0].name === query) {
					return tags;
				}

				if (tags.length <= 0) {
					return [
						{
							name: getNewTagPhrase(query),
							hue: stringToHue(query),
						},
					];
				}

				return [
					{ name: getNewTagPhrase(query), hue: stringToHue(query) },
					...tags,
				];
			},
			char: "#",
			render: () => {
				let component: ReactRenderer<TagListRef>;
				let popup: TippyInstance;

				return {
					onStart: (props) => {
						component = new ReactRenderer(TagList, {
							props,
							editor: props.editor,
						});

						if (!props.clientRect) {
							return;
						}

						popup = tippy(parentWindow.document.body, {
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							getReferenceClientRect: () => props.clientRect?.()!,
							appendTo: () => parentWindow.document.body,
							content: component.element,
							showOnCreate: true,
							interactive: true,
							trigger: "manual",
							placement: "bottom-start",
						});
					},

					onUpdate(props) {
						component.updateProps(props);

						if (!props.clientRect) {
							return;
						}

						popup.setProps({
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							getReferenceClientRect: () => props.clientRect?.()!,
						});
					},

					onKeyDown(props) {
						if (props.event.key === "Escape") {
							popup.hide();

							return true;
						}

						return component.ref?.onKeyDown(props) ?? false;
					},

					onExit() {
						popup.destroy();
						component.destroy();
					},
				};
			},
		},
	}),
	Placeholder.configure({
		placeholder: "Your next spark",
		emptyNodeClass: "text-gray-400 dark:text-neutral-200",
	}),
];
