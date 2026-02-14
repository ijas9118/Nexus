import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/molecules/alert-dialog";
import { Button } from "@/components/atoms/button";
import { ReactNode } from "react";

type ConfirmDialogProps = {
  triggerLabel: string;
  triggerVariant?:
    | "default"
    | "outline"
    | "destructive"
    | "link"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  triggerSize?: "default" | "sm" | "lg" | "icon" | null | undefined;
  triggerIcon?: ReactNode;
  triggerClassName?: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  triggerLabel,
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerIcon,
  triggerClassName,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}
        >
          {triggerIcon && <span className="mr-2">{triggerIcon}</span>}
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
