import { createStore, type SnapshotFromStore } from "@xstate/store";
import { debounce } from "../utils/debounce";
import { extractTags } from "../utils/stringUtils";
import { useSelector } from "@xstate/store/react";

export const demoModeStore = createStore({
	// Initial context
	context: { demoModeUntil: undefined } as {
		demoModeUntil: Date | undefined
	},
	// Transitions
	on: {
		update: {
			demoModeUntil: (_context, event: { until: Date | undefined }) => {
				return event.until;
			},
		},
	},
});

export const setDemoModeUntil = (until: Date) => {
	demoModeStore.send({
		type: 'update',
		until,
	})
}

export const disableDemoMode = () => {
	demoModeStore.send({
		type: 'update',
		until: undefined,
	})
}

export const useDemoModeStore = <T>(
	selector: (snapshot: SnapshotFromStore<typeof demoModeStore>) => T,
) => {
	return useSelector(demoModeStore, selector);
};

declare global {
	interface Window {
		demoModeStore: typeof demoModeStore;
		debugDemoModeStore?: boolean;
	}
}

if (typeof window !== "undefined") {
	window.demoModeStore = demoModeStore;
}

// window.debugQueryStore = true;
demoModeStore.inspect((event) => {
	if (window.debugDemoModeStore) {
		console.log(event);
	}
});