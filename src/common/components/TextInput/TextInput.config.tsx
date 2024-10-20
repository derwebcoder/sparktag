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
import type { PlainTag } from "../../../interfaces/Tag";
import {
	SparkExtensionList,
	type SparkExtensionListRef,
} from "./SparkExtensionList/SparkExtensionList";
import { PluginKey } from "@tiptap/pm/state";

type Settings = {
	parentWindow: Window;
	allowAddingTags: boolean;
	placeholder?: string;
};

export const getExtensions = (settings: Settings) => {
	const { parentWindow, allowAddingTags, placeholder } = settings;
	return [
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
		Mention
			// see https://github.com/ueberdosis/tiptap/issues/2219
			.extend({ name: "tags" })
			.configure({
				HTMLAttributes: {
					class: "tag",
				},
				renderHTML({ options, node }) {
					return [
						"span",
						mergeAttributes(
							{
								style: `--tag-color: ${tagService.getTagHueFromCache(`${node.attrs.id}`)}`,
							},
							options.HTMLAttributes,
						),
						`${options.suggestion.char}${node.attrs.id}`,
					];
				},
				suggestion: {
					items: async ({ query }) => {
						const tags: PlainTag[] = await tagService.find(
							query.toLowerCase(),
							5,
						);

						if (query.length <= 0) {
							return tags;
						}

						if (tags.length === 1 && tags[0].name === query) {
							return tags;
						}

						if (allowAddingTags) {
							tags.unshift({
								name: getNewTagPhrase(query),
								hue: stringToHue(query),
							});
						}

						return tags;
					},
					char: "#",
					// see https://github.com/ueberdosis/tiptap/issues/2219
					pluginKey: new PluginKey("tags"),
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
									getReferenceClientRect: () =>
										// biome-ignore lint/style/noNonNullAssertion: <explanation>
										props.clientRect?.()!,
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
									getReferenceClientRect: () =>
										// biome-ignore lint/style/noNonNullAssertion: <explanation>
										props.clientRect?.()!,
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
								if (!popup.state.isDestroyed) {
									popup.destroy();
								}
								component.destroy();
							},
						};
					},
				},
			}),
		Mention
			// see https://github.com/ueberdosis/tiptap/issues/2219
			.extend({ name: "SparkExtensions" })
			.configure({
				HTMLAttributes: {
					class: "extension",
				},
				renderHTML({ options, node }) {
					return [
						"span",
						mergeAttributes(
							{
								class: "spark-extension",
							},
							options.HTMLAttributes,
						),
						`/  ${node.attrs.id}`,
					];
				},
				suggestion: {
					items: async ({ query }) => {
						return ["learn", "todo"].filter((s) =>
							s.includes(query),
						);
					},
					char: "/",
					// see https://github.com/ueberdosis/tiptap/issues/2219
					pluginKey: new PluginKey("sparkExtensions"),
					render: () => {
						let component: ReactRenderer<SparkExtensionListRef>;
						let popup: TippyInstance;

						return {
							onStart: (props) => {
								component = new ReactRenderer(
									SparkExtensionList,
									{
										props,
										editor: props.editor,
									},
								);

								if (!props.clientRect) {
									return;
								}

								popup = tippy(parentWindow.document.body, {
									getReferenceClientRect: () =>
										// biome-ignore lint/style/noNonNullAssertion: <explanation>
										props.clientRect?.()!,
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
									getReferenceClientRect: () =>
										// biome-ignore lint/style/noNonNullAssertion: <explanation>
										props.clientRect?.()!,
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
								if (!popup.state.isDestroyed) {
									popup.destroy();
								}
								component.destroy();
							},
						};
					},
				},
			}),
		Placeholder.configure({
			placeholder,
			emptyNodeClass: "text-gray-400 dark:text-neutral-200",
		}),
	];
};
