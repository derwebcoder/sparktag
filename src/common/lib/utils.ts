import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// automatically created by shadcn init
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
