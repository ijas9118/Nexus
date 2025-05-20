import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules/alert-dialog";
import React from "react";
import { useNavigate } from "react-router-dom";

interface PremiumAccessAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PremiumAccessAlert: React.FC<PremiumAccessAlertProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>🔒 Premium Content</AlertDialogTitle>
          <AlertDialogDescription>
            This content is exclusive to premium members. Upgrade now to get
            full access!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => navigate("/pricing")}>
            Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PremiumAccessAlert;
