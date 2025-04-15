import { Checkbox } from "@/components/atoms/checkbox";
import { Label } from "@/components/atoms/label";
import React from "react";

interface CheckboxGroupProps {
  items: { value: string; label: string }[];
  idPrefix: string;
  columns?: number;
  value: string[]; // Controlled values
  onChange: (selected: string[]) => void; // Update callback
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  items,
  idPrefix,
  columns = 2,
  value,
  onChange,
}) => {
  const handleChange = (checked: boolean, itemValue: string) => {
    if (checked) {
      onChange([...value, itemValue]);
    } else {
      onChange(value.filter((val) => val !== itemValue));
    }
  };

  return (
    <div
      className={`grid grid-cols-1 ${
        columns > 1 ? `md:grid-cols-${columns}` : ""
      } gap-2`}
    >
      {items.map((item) => (
        <div key={item.value} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-${item.value}`}
            checked={value.includes(item.value)}
            onCheckedChange={(checked) => handleChange(!!checked, item.value)}
          />
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
