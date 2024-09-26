import BoMPicker from "@/components/cards/BoMPicker";
import BomSchedule from "@/components/forms/BoMSchedule";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { IBookSession } from "@/lib/types/bookSession";
import React, { useState } from "react";

interface Props {
  open: boolean;
  close: () => void;
  bookSessions: IBookSession[];
  handleSubmit: (
    bookSession: IBookSession,
    startDate: Date,
    endDate: Date
  ) => void;
}

const StartReadingModal = ({
  open,
  close,
  bookSessions,
  handleSubmit,
}: Props) => {
  const [step, setStep] = useState(1);
  const [selectedBook, setSelectedBook] = React.useState<IBookSession>(
    bookSessions[0]
  );
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const handleSubmitBookSelection = (bookSession: IBookSession) => {
    setSelectedBook(bookSession);
    setStep(2);
  };

  const handleSubmitDateSelection = (
    inputStartDate: Date,
    inputEndDate: Date
  ) => {
    setStartDate(startDate);
    setEndDate(endDate);

    handleSubmit(selectedBook, inputStartDate, inputEndDate);
  };
  return (
    <Dialog open={open} onOpenChange={() => close()}>
      <DialogContent>
        <DialogTitle>Start Reading</DialogTitle>
        <DialogDescription>
          {bookSessions.length > 1
            ? "Your club had some trouble deciding. Please select a book to read."
            : "Your club has successfully decided on a book to read. Please confirm."}
        </DialogDescription>
        {step === 1 && (
          <BoMPicker
            bookSessions={bookSessions}
            handleSubmit={(book) => handleSubmitBookSelection(book)}
          />
        )}
        {step === 2 && (
          <BomSchedule
            schedule={{ from: startDate, to: endDate }}
            next={(startDate, endDate) => {
              handleSubmitDateSelection(startDate, endDate);
            }}
            back={() => setStep(1)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StartReadingModal;
