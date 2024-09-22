import { useLiveQuery } from "dexie-react-hooks";
import { sparkService } from "../../scripts/db/SparkService";

export const SparkList = () => {
	const sparks = useLiveQuery(() => sparkService.listSparks());

	return (
		<ul>
			{sparks?.map((spark) => (
				<li key={spark.id}>{spark.plainText}</li>
			))}
		</ul>
	);
};
