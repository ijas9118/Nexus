import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "@/assets/chat_animation.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
};
