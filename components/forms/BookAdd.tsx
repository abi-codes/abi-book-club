import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import BookshelfBook from "./BookshelfBook";
import { IBook } from "@/lib/types/book";
import { IBookSession } from "@/lib/types/bookSession";

interface Props {
  open: boolean;
  close: () => void;
  currentBook: IBook | undefined;
  onSubmitBook: (book: any) => void;
}
const BookAdd = ({ open, close, currentBook, onSubmitBook }: Props) => {
  return (
    <Dialog open={open} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Queue</DialogTitle>
          <DialogDescription>
            Create a queue for members of your club to pick a book of the month
          </DialogDescription>
        </DialogHeader>
        <BookshelfBook
          book={currentBook}
          back={() => close()}
          onSubmit={(book) => onSubmitBook(book)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookAdd;
