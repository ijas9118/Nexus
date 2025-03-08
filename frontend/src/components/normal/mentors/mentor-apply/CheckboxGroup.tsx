// CheckboxGroup.jsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxGroupProps {
  items: { value: string; label: string }[];
  idPrefix: string;
  columns?: number;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  items,
  idPrefix,
  columns = 2,
}) => {
  return (
    <div
      className={`grid grid-cols-1 ${columns > 1 ? `md:grid-cols-${columns}` : ""} gap-2`}
    >
      {items.map((item) => (
        <div key={item.value} className="flex items-center space-x-2">
          <Checkbox id={`${idPrefix}-${item.value}`} />
          <Label
            htmlFor={`${idPrefix}-${item.value}`}
            className="text-sm font-normal"
          >
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxGroup;
