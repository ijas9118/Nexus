"use client";

import type React from "react";

import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Switch } from "@/components/atoms/switch";
import type { Category } from "@/types/category";
import { type FC, useEffect, useState } from "react";
import { useUpdateCategory } from "../hooks/use-categories";

interface EditCategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
}

const EditCategoryModal: FC<EditCategoryModalProps> = ({
  category,
  isOpen,
  onClose,
  onToggleStatus,
}) => {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [originalName, setOriginalName] = useState("");

  // Use React Query mutation hook
  const updateCategoryMutation = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIsActive(category.isActive);
      setOriginalName(category.name);
    }
  }, [category]);

  const handleStatusChange = (checked: boolean) => {
    if (!category) return;

    // Update UI immediately
    setIsActive(checked);

    // Call the toggle mutation
    onToggleStatus(category._id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) return;

    // Only update if name has changed
    if (name !== originalName) {
      updateCategoryMutation.mutate(
        { id: category._id, newName: name },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="status"
                  checked={isActive}
                  onCheckedChange={handleStatusChange}
                />
                <Label htmlFor="status" className="cursor-pointer">
                  {isActive ? "Active" : "Inactive"}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateCategoryMutation.isPending}>
              {updateCategoryMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
