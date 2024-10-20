import { TextInput } from "../../common/components/TextInput/TextInput";
import { updateQueryDebounced } from "../../scripts/store/queryStore";
import { extractTags } from "../../scripts/utils/stringUtils";

export const SearchInput = () => {
	const handleChange = (htmlString: string) => {
		updateQueryDebounced(htmlString);
	};
	return (
		<div>
			<TextInput
				allowAddingTags={false}
				onChange={handleChange}
				style="search"
			/>
		</div>
	);
};
