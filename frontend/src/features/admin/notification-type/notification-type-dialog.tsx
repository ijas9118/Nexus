import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import type { NotificationTypeData } from "@/types/notification";
import NotificationTypeForm from "./notification-type-form";

interface NotificationTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: NotificationTypeData | null;
  onSubmit: (data: any) => void;
  title: string;
  isEditing?: boolean;
}

export default function NotificationTypeDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  title,
  isEditing = false,
}: NotificationTypeDialogProps) {
  const handleSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <NotificationTypeForm
          initialData={initialData || undefined}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
}
