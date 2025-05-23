import { ScrollArea, ScrollBar } from "@/components/organisms/scroll-area";
import { Category } from "@/types/category";
import { FC } from "react";

interface CategoryScrollProps {
  categories: Category[];
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
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
            key={category._id}
            onClick={() => onCategorySelect(category)}
            className={`flex h-14 items-center border-b-2  ${
              selectedCategory?._id === category._id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground"
            } px-2 text-sm font-medium transition-colors hover:text-foreground`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryScroll;
