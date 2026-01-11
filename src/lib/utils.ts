
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBikeId(id: string, index?: number): string {
  if (typeof index === 'number') {
    return `EBK-${(index + 1).toString().padStart(3, '0')}`;
  }
  // Fallback for when index is not available, less ideal
  return `EBK-${id.substring(0, 4).toUpperCase()}`;
}
