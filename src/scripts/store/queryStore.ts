import { createStore, type SnapshotFromStore } from "@xstate/store";
import { debounce } from "../utils/debounce";
import { extractTags } from "../utils/stringUtils";
import { useSelector } from "@xstate/store/react";

export const queryStore = createStore({
	// Initial context
	context: { query: [] } as { query: string[] },
	// Transitions
	on: {
		update: {
			query: (_context, event: { value: string[] }) => event.value,
		},
		clear: {
			query: () => [],
		},
	},
});

const extractTagsAndUpdateDebounced = debounce((queryString: string) => {
	const newQuery = extractTags(queryString);
	queryStore.send({
		type: "update",
		value: newQuery,
	});
}, 300);

export const updateQueryDebounced = (queryString?: string) => {
	if (!queryString || queryString.trim() === "") {
		queryStore.send({
			type: "clear",
		});
		return;
	}

	extractTagsAndUpdateDebounced(queryString);
};

export const useQueryStore = <T>(
	selector: (snapshot: SnapshotFromStore<typeof queryStore>) => T,
) => {
	return useSelector(queryStore, selector);
};

declare global {
	interface Window {
		queryStore: typeof queryStore;
		debugQueryStore?: boolean;
	}
}

if (typeof window !== "undefined") {
	window.queryStore = queryStore;
}

// window.debugQueryStore = true;
queryStore.inspect((event) => {
	if (window.debugQueryStore) {
		console.log(event);
	}
});

// // Get the current state (snapshot)
// console.log(store.getSnapshot());
// // => {
// //   status: 'active',
// //   context: { count: 0, name: 'David' }
// // }

// // Subscribe to snapshot changes
// store.subscribe((snapshot) => {
// 	console.log(snapshot.context);
// });

// // Send an event
// store.send({ type: "inc" });
// // logs { count: 1, name: 'David' }

// store.send({ type: "add", num: 10 });
// // logs { count: 11, name: 'David' }

// store.send({ type: "changeName", newName: "Jenny" });
// // logs { count: 11, name: 'Jenny' }
