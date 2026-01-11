
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBikeId(id: string): string {
  // Always use the first 4 characters of the document ID for a consistent display ID.
  return `EBK-${id.substring(0, 4).toUpperCase()}`;
}
