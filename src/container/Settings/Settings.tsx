import { format } from "date-fns";
import { CogIcon } from "../../assets/icons/CogIcon";
import { XIcon } from "../../assets/icons/XIcon";
import { IconButton } from "../../common/components/IconButton/IconButton";
import { Button } from "../../common/components/shadcn/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../../common/components/shadcn/drawer";
import { useToast } from "../../common/hooks/use-toast";
import { sparkService } from "../../scripts/db/SparkService";
import FileBackupJSONWorker from "../../scripts/files/backupJSONWorker?worker";
import FileBackupMarkdownWorker from "../../scripts/files/backupMarkdownWorker?worker";

export const Settings = () => {
	const { toast } = useToast();

	const handleExportAsJson = async () => {
		const worker = new FileBackupJSONWorker();
		const fileHandle = await window.showSaveFilePicker({
			types: [
				{
					description: "JSON files",
					accept: {
						"application/json": [".json"],
					},
				},
			],
			id: "manual-export",
			excludeAcceptAllOption: true,
		});

		worker.postMessage(fileHandle);
		worker.onmessage = (e: MessageEvent<"success" | "fail">) => {
			if (e.data === "success") {
				toast({
					title: "Backup successfully!",
					description: `All data was stored as JSON in "${fileHandle.name}".`,
				});
			} else {
				toast({
					title: "Backup failed!",
					description: `JSON backup to "${fileHandle.name}" failed. Please try a different file.`,
					variant: "destructive",
				});
			}
		};
	};

	const handleExportAsMarkdown = async () => {
		const worker = new FileBackupMarkdownWorker();
		const fileHandle = await window.showSaveFilePicker({
			types: [
				{
					description: "Markdown files",
					accept: {
						"text/markdown": [".md"],
					},
				},
			],
			id: "manual-export",
			excludeAcceptAllOption: true,
		});

		worker.postMessage(fileHandle);
		worker.onmessage = (e: MessageEvent<"success" | "fail">) => {
			if (e.data === "success") {
				toast({
					title: "Export successfully!",
					description: `All data was stored as Markdown in "${fileHandle.name}".`,
				});
			} else {
				toast({
					title: "Export failed!",
					description: `Markdown export to "${fileHandle.name}" failed. Please try a different file.`,
					variant: "destructive",
				});
			}
		};
	};

	const handleRestoreBackup = async () => {
		try {
			const [fileHandle] = await window.showOpenFilePicker({
				types: [
					{
						description: "JSON files",
						accept: {
							"application/json": [".json"],
						},
					},
				],
				id: "manual-export",
				excludeAcceptAllOption: true,
			});

			const content = await (await fileHandle.getFile()).text();

			const data = JSON.parse(content);

			await sparkService.CAREFUL_deleteAndImportSparks(data);

			toast({
				title: "Backup Restored",
				description: `Current data was overriden with your backup from "${fileHandle.name}".`,
			});
		} catch (e) {
			toast({
				title: "Restoring Backup Failed",
				description:
					"The data from the backup could not be restored. Please try a different file.",
			});
		}
	};

	const handleDeleteEverything = async () => {
		await sparkService.CAREFUL_deleteAllData();
		toast({
			title: "All Data Erased",
			description: "All your data has been deleted as per your request.",
		});
	};

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<IconButton
					type="button"
					aria-label="Open the settings"
					relevancy="secondary"
				>
					<CogIcon />
				</IconButton>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto max-w-md">
					<DrawerHeader className="flex flex-row justify-between place-items-center">
						<DrawerTitle>Application Settings</DrawerTitle>
						<DrawerClose asChild>
							<Button
								variant="ghost"
								size="icon"
							>
								<XIcon />
							</Button>
						</DrawerClose>
					</DrawerHeader>
				</div>
				<div className="pb-10 px-16 grid grid-cols-3 gap-10">
					<div className="flex flex-col gap-4">
						<h3 className="font-semibold">Backups</h3>
						<div className="flex flex-col gap-4 p-1">
							<div className="flex flex-col gap-2">
								<span>Backups Setting</span>
								<Button size="sm">Enable Backups</Button>
								<p className="text-stone-400 text-sm">
									Backups will be created automatically every
									day. Only the last 7 days of usage will be
									stored.
								</p>
							</div>
							<div className="flex flex-col gap-2">
								<span>Export data</span>
								<Button
									variant="outline"
									size="sm"
									onClick={handleExportAsJson}
								>
									Export data as JSON
								</Button>
								<p className="text-stone-400 text-sm">
									A JSON file can be used to restore data.
								</p>
								<Button
									variant="outline"
									size="sm"
									onClick={handleExportAsMarkdown}
								>
									Export data as Markdown
								</Button>
								<p className="text-stone-400 text-sm">
									Markdown cannot be used to restore any data.
								</p>
							</div>
							<div className="flex flex-col gap-2">
								<span>Restore a Backup</span>
								<Button
									variant="outline"
									size="sm"
									onClick={handleRestoreBackup}
								>
									Select JSON file
								</Button>
								<p className="text-stone-400 text-sm">
									This will override existing data.
								</p>
							</div>
						</div>
					</div>
					<div />
					<div className="flex flex-col gap-4">
						<h3 className="font-semibold">Delete All Data</h3>
						<div className="flex flex-col gap-4 p-1">
							<div className="flex flex-col gap-2">
								<Button
									variant="destructive"
									size="sm"
									onClick={handleDeleteEverything}
								>
									Delete everything
								</Button>
								<p className="text-stone-400">
									This will delete all data the browser has
									stored. It will also delete all backups if
									the setting is enabled. Therefore this
									action is irreversible unless you made a
									manual backup.
								</p>
							</div>
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
