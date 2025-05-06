import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Switch } from "@/components/atoms/switch";
import type { TargetAudienceData } from "@/services/targetAudienceService";

interface AudienceFormData {
  name: string;
  isActive: boolean;
}

interface AudienceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AudienceFormData) => Promise<void>;
  audience?: TargetAudienceData | null;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

export function AudienceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  audience,
  isSubmitting,
  mode,
}: AudienceFormDialogProps) {
  const [formData, setFormData] = useState<AudienceFormData>({
    name: "",
    isActive: true,
  });

  useEffect(() => {
    if (audience && mode === "edit") {
      setFormData({
        name: audience.name,
        isActive: audience.isActive,
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        isActive: true,
      });
    }
  }, [audience, mode, open]);

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  const title =
    mode === "create" ? "Create Target Audience" : "Edit Target Audience";
  const description =
    mode === "create"
      ? "Add a new target audience segment for your campaigns."
      : "Update the details of your target audience segment.";
  const buttonText = mode === "create" ? "Create Audience" : "Update Audience";
  const loadingText = mode === "create" ? "Creating..." : "Updating...";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-sans">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter audience name"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="active-status"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label htmlFor="active-status" className="text-sm">
              Active
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingText}
              </>
            ) : (
              buttonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
