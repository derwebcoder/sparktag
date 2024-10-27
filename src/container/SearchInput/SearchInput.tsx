import { TextInput } from "../../common/components/TextInput/TextInput";
import {
	updateQueryDebounced,
	useQueryStore,
} from "../../scripts/store/queryStore";

export const SearchInputEditorAccessorId = "search";

export const SearchInput = () => {
	const handleChange = (htmlString: string) => {
		updateQueryDebounced(htmlString);
	};
	return (
		<div>
			<TextInput
				globalAccessorId={SearchInputEditorAccessorId}
				allowAddingTags={false}
				onChange={handleChange}
				style="search"
				placeholder={"Search ..."}
			/>
		</div>
	);
};
