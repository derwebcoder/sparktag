// global.d.ts
interface DocumentPictureInPicture {
	window?: Window;
	requestWindow(options: { width: number; height: number }): Promise<Window>;
}

declare global {
	interface Window {
		documentPictureInPicture?: DocumentPictureInPicture;
	}

	namespace NodeJS {
		interface ProcessEnv {
			NOT_SO_SECRET_SECRET?: string;
		}
	}
}

export type {};
