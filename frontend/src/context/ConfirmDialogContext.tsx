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
import React, { createContext, useCallback, useContext, useState } from "react";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
};

type ConfirmDialogContextType = {
  showConfirm: (options: ConfirmOptions) => void;
};

const ConfirmDialogContext = createContext<
  ConfirmDialogContextType | undefined
>(undefined);

export const ConfirmDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});

  const showConfirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setOpen(true);
  }, []);

  const handleConfirm = () => {
    options.onConfirm?.();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <ConfirmDialogContext.Provider value={{ showConfirm }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {options.title || "Are you sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {options.description || "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {options.cancelLabel || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {options.confirmLabel || "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = (): ConfirmDialogContextType => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error(
      "useConfirmDialog must be used within a ConfirmDialogProvider",
    );
  }
  return context;
};
