import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Label } from "@/components/atoms/label";
import { Switch } from "@/components/atoms/switch";
import { ConfigCategory, MentorshipConfig } from "@/types/mentor";
import { toast } from "sonner";

interface MentorshipConfigFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingConfig: MentorshipConfig | null;
  onCreate: (config: MentorshipConfig) => void;
  onUpdate: (id: string, config: Partial<MentorshipConfig>) => void;
}

const categories: ConfigCategory[] = [
  "mentorshipType",
  "targetAudience",
  "expertiseArea",
  "technology",
  "experienceLevel",
];

const MentorshipConfigForm: React.FC<MentorshipConfigFormProps> = ({
  isOpen,
  onClose,
  editingConfig,
  onCreate,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<{
    category: ConfigCategory | string;
    value: string;
    isActive: boolean;
  }>({
    category: editingConfig?.category || "",
    value: editingConfig?.value || "",
    isActive: editingConfig?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      toast.error("Error", {
        description: "Category is required",
      });
      return;
    }

    const configData = {
      category: formData.category as ConfigCategory,
      value: formData.value,
      isActive: formData.isActive,
    };

    if (editingConfig) {
      onUpdate(editingConfig._id, configData);
    } else {
      onCreate(configData as MentorshipConfig);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingConfig ? "Edit" : "Create"} Configuration
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value as ConfigCategory })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label>Active</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editingConfig ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MentorshipConfigForm;
