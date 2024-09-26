import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

interface Props {
  open: boolean;
  close: () => void;
  handleSubmit: () => void;
  validationTitle: string;
  validationDescription: string;
  cancellationText?: string;
  submitText?: string;
}

const ValidationModal = ({
  open,
  submitText,
  cancellationText,
  validationTitle,
  validationDescription,
  close,
  handleSubmit,
}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={() => close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{validationTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {validationDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {cancellationText ? cancellationText : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleSubmit()}>
            {submitText ? submitText : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ValidationModal;
