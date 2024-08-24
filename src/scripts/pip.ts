export type {};
if ("documentPictureInPicture" in window) {
	console.log("supported!");

	const trigger = document.querySelector<HTMLButtonElement>("#pip-trigger");

	if (trigger) {
		trigger.addEventListener("click", () => {
			togglePictureInPicture();
		});
	}
}

async function togglePictureInPicture() {
	// Early return if there's already a Picture-in-Picture window open
	if (window.documentPictureInPicture?.window) {
		return;
	}

	console.log("yeah");
	const output = document.querySelector<HTMLTextAreaElement>("#latest-message");

	// Open a Picture-in-Picture window.
	const pipWindow = await window.documentPictureInPicture?.requestWindow({
		width: 500,
		height: 250,
	});

	const textarea = document.createElement("textarea");
	textarea.style.width = "100%";
	textarea.style.height = "100%";

	textarea.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			if (output) {
				output.innerText = (e.target as HTMLTextAreaElement).value;
			}
		}
	});

	// Move the player to the Picture-in-Picture window.
	pipWindow?.document.body.append(textarea);

	// Display a message to say it has been moved
	//   inPipMessage.style.display = "block";
}
