import type { Tag } from "../../../interfaces/Tag";
import { Tag as TagElement } from "../../../common/components/Tag/Tag";
import { useState } from "react";
import { HueSlider } from "../../../common/components/HueSlider/HueSlider";
import { tagService } from "../../../scripts/db/TagService";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../../common/components/shadcn/popover";
import { Button } from "../../../common/components/shadcn/button";
import { debounce } from "../../../scripts/utils/debounce";
import { TextInput } from "../../../common/components/TextInput/TextInput";

type Props = {
	tag: Tag;
};

const updateHueDebounced = debounce((name: string, hue: number) => {
	tagService.updateHue(name, hue);
}, 500);

const updateDescriptionDebounced = debounce(
	(name: string, description: string) => {
		tagService.updateDescription(name, description);
	},
	1000,
);

export const TagConfig = (props: Props) => {
	const { tag } = props;
	const [hue, setHue] = useState(tag.hue);

	const handleHueChange = (value: number) => {
		setHue(value);
		updateHueDebounced(tag.name, value);
	};

	return (
		<div className="grid grid-cols-subgrid col-span-3 border-b border-stone-200 py-2 w-full items-center gap-4">
			<div className="justify-self-center">
				<TagElement
					name={tag.name}
					hue={hue}
				/>
			</div>
			<div>
				<TextInput
					enableTags={false}
					enableExtension={false}
					placeholder="Add a description"
					content={tag.description}
					style="invisible"
					onChange={(html) =>
						updateDescriptionDebounced(tag.name, html)
					}
				/>
			</div>
			<div>
				<Popover modal={true}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							className="flex gap-1"
						>
							<div
								className="w-3 h-3"
								style={{
									background: `hsl(${hue} 50% 70% / 100%)`,
								}}
							/>{" "}
							Color
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<HueSlider
							hue={hue}
							onChange={handleHueChange}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
};
