import { ScrollArea, ScrollBar } from "@/components/organisms/scroll-area";
import { FC } from "react";

interface CategoryScrollProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategoryScroll: FC<CategoryScrollProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <ScrollArea className="max-w-[80%]">
      <div className="flex h-14 items-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`flex h-14 items-center border-b-2  ${
              category === selectedCategory
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground"
            } px-2 text-sm font-medium transition-colors hover:text-foreground`}
          >
            {category}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryScroll;
