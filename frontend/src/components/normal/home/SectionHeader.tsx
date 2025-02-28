import React from "react";
import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  badgeText: string;
  heading: string;
  description?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  badgeText,
  heading,
  description,
}) => {
  return (
    <div className="text-center mb-16">
      <Badge
        variant="destructive"
        className="text-sm font-light py-2 px-4 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 dark:from-indigo-900 dark:to-indigo-950 border-0"
      >
        <span className="mr-1">✨</span> {badgeText}
      </Badge>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-neutral-50/70 my-8 max-w-4xl mx-auto ">
        {heading}
      </h2>
      {description && (
        <p className="dark:text-neutral-300 max-w-2xl mx-auto text-lg">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
