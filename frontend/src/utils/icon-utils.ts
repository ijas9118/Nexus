import * as LucideIcons from "lucide-react";

export function isValidLucideIcon(iconName: string): boolean {
  if (!iconName) return false;

  // Check if the icon exists in Lucide
  return Object.prototype.hasOwnProperty.call(LucideIcons, iconName);
}

export function getAllLucideIconNames(): string[] {
  // Get all icon names from Lucide
  return Object.keys(LucideIcons).filter(
    (key) => typeof LucideIcons[key as keyof typeof LucideIcons] === "function",
  );
}
