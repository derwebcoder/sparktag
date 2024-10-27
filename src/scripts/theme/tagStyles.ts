export const tagStyles = [
	"neon",
	"chip-light",
	"chip-dark",
	"chip-border",
	"chip-icon-light",
	"chip-icon-dark",
];
export type TagStyle = (typeof tagStyles)[number];
export const DEFAULT_TAG_STYLE: TagStyle = "neon";
const LS_TAG_STYLE_NAME = "CUSTOM_TAG_STYLE";

export const setTagStyle = (style: TagStyle) => {
	localStorage.setItem(LS_TAG_STYLE_NAME, style);
	// biome-ignore lint/complexity/noForEach: it's a special method on the token list type
	document.body.classList.forEach((style) => {
		if (tagStyles.includes(style)) {
			document.body.classList.remove(style);
		}
	});
	document.body.classList.add(style);
};

export const getTagStyle = () => {
	return (
		(localStorage.getItem(LS_TAG_STYLE_NAME) as TagStyle) ??
		DEFAULT_TAG_STYLE
	);
};
