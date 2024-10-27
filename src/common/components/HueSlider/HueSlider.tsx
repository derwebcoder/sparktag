import type { ChangeEvent } from "react";
import { Input } from "../shadcn/input";
import { Slider } from "../shadcn/slider";
import styles from "./HueSlider.module.css";

export type HueSliderProps = {
	hue: number;
	onChange: (hue: number) => void;
};

export const HueSlider = (props: HueSliderProps) => {
	const { hue, onChange } = props;

	return (
		<span className="w-full p-2 grid grid-cols-[60px_1fr] gap-2">
			<Input
				type="number"
				value={hue}
				data-testid="hue-input"
				className="text-xs text-right p-0 h-6"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onChange={(e) => onChange(Number.parseInt(e.target.value, 10))}
			/>
			<div className="flex flex-col justify-between">
				<div className={`h-2 w-full ${styles.gradient}`} />
				<Slider
					value={[hue]}
					min={0}
					max={360}
					step={1}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
					onValueChange={(v) => onChange(v[0])}
				/>
			</div>
		</span>
	);
};
