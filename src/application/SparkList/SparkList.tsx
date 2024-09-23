import { useLiveQuery } from "dexie-react-hooks";
import { sparkService } from "../../scripts/db/SparkService";
import { format } from "date-fns";
import type Spark from "../../interfaces/Spark";

export const SparkList = () => {
	const sparks = useLiveQuery(() => sparkService.listSparks());

	const grouped = sparks?.reduce<
		{
			key: string;
			prefixTags: string[];
			sparks: Spark[];
		}[]
	>((tmpGrouped, spark) => {
		const prevKey =
			tmpGrouped.length > 0
				? tmpGrouped[tmpGrouped.length - 1].key
				: `${Math.random()}`;
		const nextKey =
			spark.contextTags.length > 0
				? spark.contextTags.join("/")
				: `${Math.random()}`;
		if (prevKey === "" || prevKey !== nextKey) {
			tmpGrouped.push({
				key: nextKey,
				prefixTags: spark.contextTags,
				sparks: [spark],
			});
			return tmpGrouped;
		}

		tmpGrouped[tmpGrouped.length - 1].sparks.push(spark);
		return tmpGrouped;
	}, []);

	return (
		<div className="flex flex-col gap-16 py-10 bg-white h-full overflow-y-auto px-8">
			{grouped?.map((group) => (
				<section
					key={group.key}
					className="grid grid-cols-[25%_1fr] gap-8"
				>
					<div className="py-2 border-e border-slate-300 pe-4">
						<div className="sticky top-1 flex flex-col gap-1">
							{group.prefixTags.map((tag) => (
								<span
									key={tag}
									className="font-bold text-md text-neutral-400"
								>
									{tag}
								</span>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-10 py-2">
						{group.sparks?.map((spark) => (
							<article
								key={spark.id}
								className="flex flex-col gap-1"
							>
								<p className="text-neutral-900">
									{spark.plainText}
								</p>
								<span className="text-neutral-500 font-thin text-xs ps-2">
									{format(
										new Date(spark.creationDate),
										"dd.MM.yyyy",
									)}
								</span>
							</article>
						))}
					</div>
				</section>
			))}
		</div>
	);
};
