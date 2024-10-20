// biome-ignore lint/complexity/noBannedTypes: <explanation>
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const debounce = <T extends any[]>(
	callback: (...args: T) => void,
	wait: number,
) => {
	let timeoutId: number | undefined = undefined;
	return (...args: T) => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			callback.apply(null, args);
		}, wait);
	};
};
