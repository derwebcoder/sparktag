import { sparkService } from "../db/SparkService";
import { tagService } from "../db/TagService";

self.onmessage = async (e: MessageEvent<FileSystemFileHandle>) => {
	try {
		const jsonData = JSON.stringify({
			version: 6,
			sparks: await sparkService.listSparks(),
			tags: await tagService.listTags(),
		});

		const fileHandle = e.data;
		const writeable = await fileHandle.createWritable();
		await writeable.write(jsonData);
		await writeable.close();

		self.postMessage("success");
	} catch (e) {
		console.error(e);
		self.postMessage("fail");
	}
};
