import { useState } from "react";
import { EditIcon } from "../../../assets/icons/EditIcon";
import { IconButton } from "../../../common/components/IconButton/IconButton";
import type { Spark } from "../../../interfaces/Spark";
import { TextInput } from "../../../common/components/TextInput/TextInput";
import { sparkService } from "../../../scripts/db/SparkService";
import { TrashIcon } from "../../../assets/icons/TrashIcon";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../../../common/components/shadcn/alert-dialog";
import { Button } from "../../../common/components/shadcn/button";

type Props = {
	spark: Spark;
	blur?: boolean;
};

export const SparkItem = (props: Props) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const { spark, blur = "false" } = props;

	const handleSubmit = async (plainText: string, html: string) => {
		await sparkService.updateSpark(spark.id, plainText, html);
		setIsEditing(false);
	};

	const handleEscape = () => {
		setIsEditing(false);
	};

	const handleTrashClicked = async () => {
		setIsDeleting(true);
	};

	const handleDelete = async () => {
		await sparkService.deleteSpark(spark.id);
	};

	return (
		<article
			key={spark.id}
			className={`flex group relative ${blur ? "blur-sm" : ""}`}
		>
			{isEditing ? (
				<div className="w-full h-full">
					<TextInput
						onSubmit={handleSubmit}
						content={spark.originalHtml}
						onEscape={handleEscape}
					/>
				</div>
			) : (
				<p
					className="break-words [word-break:break-word] text-sm min-h-3"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: just rendering it
					dangerouslySetInnerHTML={{
						__html: spark.html,
					}}
				/>
			)}
			<div
				className={`hidden ${isEditing ? "" : "group-hover:flex"} absolute bottom-0 right-1 flex-row gap-1`}
			>
				<IconButton
					type="button"
					onClick={() => setIsEditing(!isEditing)}
					title="detach"
					relevancy="secondary"
				>
					<EditIcon />
				</IconButton>
				<IconButton
					type="button"
					onClick={handleTrashClicked}
					title="detach"
					relevancy="secondary"
				>
					<TrashIcon />
				</IconButton>
			</div>
			<AlertDialog
				open={isDeleting}
				onOpenChange={setIsDeleting}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete this spark?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently
							delete this spark.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setIsDeleting(false)}>
							Cancel
						</AlertDialogCancel>
						<Button
							onClick={handleDelete}
							variant={"destructive"}
						>
							<TrashIcon /> Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</article>
	);
};
