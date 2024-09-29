import { useLiveQuery } from "dexie-react-hooks";
import { sparkService } from "../../scripts/db/SparkService";
import { differenceInCalendarDays, format } from "date-fns";
import type Spark from "../../interfaces/Spark";

type SparkSection = {
	key: string;
	prefixTags: string[];
	sparks: Spark[];
	type: "sparks";
};

type DateSection = {
	key: string;
	date: Date;
	type: "date";
};

type Section = SparkSection | DateSection;

export const SparkList = () => {
	const sparks = useLiveQuery(() => sparkService.listSparks());

	const sections = sparks?.reduce<Section[]>((tmpSections, spark) => {
		const prevSection =
			tmpSections.length > 0
				? tmpSections[tmpSections.length - 1]
				: undefined;

		const prevSectionKey = prevSection?.key;

		if (prevSection?.type === "date") {
			// this can logically actually not happen because we always add a spark at the end
			return tmpSections;
		}

		const nextKey =
			spark.contextTags.length > 0
				? spark.contextTags.join("/")
				: `${Math.random()}`;
		const nextDate = new Date(spark.creationDate);

		// if it's the first entry, just add a date section and the spark
		if (!prevSection) {
			tmpSections.push({
				type: "date",
				key: nextDate.toUTCString(),
				date: nextDate,
			});
			tmpSections.push({
				type: "sparks",
				key: nextKey,
				prefixTags: spark.contextTags,
				sparks: [spark],
			});
			return tmpSections;
		}

		// check the date of the latest spark in the prevSection.
		// If the date is not the same, add a new date section first and then a new spark section
		const prevDate = new Date(prevSection.sparks[0].creationDate);
		if (differenceInCalendarDays(prevDate, nextDate) >= 1) {
			tmpSections.push({
				type: "date",
				key: nextDate.toUTCString(),
				date: nextDate,
			});
			tmpSections.push({
				type: "sparks",
				key: nextKey,
				prefixTags: spark.contextTags,
				sparks: [spark],
			});
			return tmpSections;
		}

		// if the key diff because the next spark has different context tags, we create a new section
		if (prevSectionKey !== nextKey) {
			tmpSections.push({
				key: nextKey,
				prefixTags: spark.contextTags,
				sparks: [spark],
				type: "sparks",
			});
			return tmpSections;
		}

		// otherwise if the keys match (meaning same context tags) we add the spark to the previous section
		prevSection.sparks.push(spark);
		return tmpSections;
	}, []);

	return (
		<div className="flex flex-col py-10 bg-white h-full px-8">
			{sections?.map((section) => {
				if (section.type === "sparks") {
					return (
						<section
							key={section.key}
							className="grid grid-cols-[25%_1fr] gap-4 mb-6"
						>
							<div className="py-2 border-e border-slate-300 pe-4">
								<div className="sticky top-4 flex flex-col gap-1 text-end">
									{section.prefixTags.map((tag) => (
										<span
											key={tag}
											className="font-semibold text-neutral-400 text-sm"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
							<div className="flex flex-col gap-4 py-2">
								{section.sparks?.map((spark) => (
									<article
										key={spark.id}
										className="flex flex-col gap-1"
									>
										{/* <p
									className="text-neutral-900"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
									dangerouslySetInnerHTML={{
										__html: spark.html,
									}}
								/> */}
										<p className="text-neutral-900 text-sm break-words [word-break:break-word]">
											{spark.plainText}
										</p>
									</article>
								))}
							</div>
						</section>
					);
				}
				if (section.type === "date") {
					return (
						<span
							className="text-neutral-400 text-sm ps-3 mb-2"
							key={section.date.toString()}
						>
							{format(section.date, "dd.MM.yyyy")}
						</span>
					);
				}
			})}
		</div>
	);
};