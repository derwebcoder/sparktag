import { sparkService } from "../db/SparkService";

self.onmessage = async (e: MessageEvent<FileSystemFileHandle>) => {
	try {
		const jsonData = JSON.stringify(
			await sparkService.listSparksWithTags(),
		);

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
