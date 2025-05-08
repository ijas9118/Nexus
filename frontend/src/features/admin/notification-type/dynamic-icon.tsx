import type React from "react";
import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { AlertCircle } from "lucide-react";

interface DynamicIconProps {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}

export function DynamicIcon({
  name,
  color = "currentColor",
  size = 24,
  className = "",
}: DynamicIconProps) {
  const [Icon, setIcon] = useState<React.ElementType | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!name) {
      setError(true);
      return;
    }

    // Check if the icon exists in Lucide
    const LucideIcon = (
      LucideIcons as unknown as Record<string, React.ElementType>
    )[name];

    if (LucideIcon) {
      setIcon(() => LucideIcon);
      setError(false);
    } else {
      setError(true);
    }
  }, [name]);

  if (error) {
    return <AlertCircle size={size} className={className} color="red" />;
  }

  if (!Icon) {
    return null;
  }

  return <Icon size={size} color={color} className={className} />;
}
