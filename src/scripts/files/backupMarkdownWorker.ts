import { format } from "date-fns";
import { sparkService } from "../db/SparkService";

self.onmessage = async (e: MessageEvent<FileSystemFileHandle>) => {
	try {
		const allSparks = await sparkService.listSparks();
		const markdown = allSparks
			.map(
				(spark) => `
# ${spark.contextTags}
> ${spark.plainText}
_${format(spark.creationDate, "dd.MM.yyyy HH:mm")}_`,
			)
			.join("\n");

		const fileHandle = e.data;
		const writeable = await fileHandle.createWritable();
		await writeable.write(markdown);
		await writeable.close();

		self.postMessage("success");
	} catch (e) {
		console.error(e);
		self.postMessage("fail");
	}
};
