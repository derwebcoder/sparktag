import { createStore, type SnapshotFromStore } from "@xstate/store";
import { debounce } from "../utils/debounce";
import { extractTags } from "../utils/stringUtils";
import { useSelector } from "@xstate/store/react";

export const queryStore = createStore({
	// Initial context
	context: { tags: [], queryHtml: "" } as {
		tags: string[];
		queryHtml: string;
	},
	// Transitions
	on: {
		updateTags: {
			tags: (_context, event: { html: string }) => {
				return extractTags(event.html);
			},
		},
		updateQueryHtml: {
			queryHtml: (_context, event: { html: string }) => {
				return event.html;
			},
		},
		clear: {
			tags: () => [],
			queryHtml: () => "",
		},
	},
});

const extractTagsAndUpdateDebounced = debounce((queryString: string) => {
	queryStore.send({
		type: "updateTags",
		html: queryString,
	});
}, 300);

export const updateQueryDebounced = (queryString?: string) => {
	if (!queryString || queryString.trim() === "") {
		queryStore.send({
			type: "clear",
		});
		return;
	}

	queryStore.send({
		type: "updateQueryHtml",
		html: queryString,
	});
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
