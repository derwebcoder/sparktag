import type { Tag } from "../../../interfaces/Tag";
import { Tag as TagElement } from "../../../common/components/Tag/Tag";
import { useState } from "react";
import { HueSlider } from "../../../common/components/HueSlider/HueSlider";
import { tagService } from "../../../scripts/db/TagService";

type Props = {
	tag: Tag;
};

export const TagConfig = (props: Props) => {
	const { tag } = props;
	const [hue, setHue] = useState(tag.hue);

	const handleHueChange = (value: number) => {
		setHue(value);
		tagService.updateHue(tag.name, value);
	};

	return (
		<div className="grid grid-cols-subgrid col-span-2 border-b border-stone-200 py-2 w-full">
			<div className="place-self-center">
				<TagElement
					name={tag.name}
					hue={hue}
				/>
			</div>
			<div>
				<HueSlider
					hue={hue}
					onChange={handleHueChange}
				/>
			</div>
		</div>
	);
};
