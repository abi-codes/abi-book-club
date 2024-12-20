import React, { useEffect, useState } from "react";
import BookshelfBook from "./BookshelfBook";
import BookshelfType from "./BookshelfType";
import { usePathname } from "next/navigation";
import { updateUserBookshelf } from "@/lib/actions/user.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import BookshelfRating from "./BookShelfRating";

interface Props {
  shelfItem: any | null;
  userId: string;
  open: boolean;
  handleClose: () => void;
}

const BookshelfItem = ({ shelfItem, userId, open, handleClose }: Props) => {
  const [bookshelfItem, setBookshelfItem] = useState<any>(
    shelfItem ? shelfItem : null
  );

  const [step, setStep] = useState(1);
  // const [open, setOpen] = useState(open);

  const pathname = usePathname();

  const handClose = (value: any) => {
    !value && handleClose();
    !value && setStep(1);
  };

  const handleBookSelection = (book: any) => {
    setBookshelfItem({
      ...bookshelfItem,
      book: book,
    });

    setStep(2);
  };

  const handleCategorySelection = (category: any) => {
    setBookshelfItem({
      ...bookshelfItem,
      category: category,
    });

    //Run this because useEffect wont run if you dont change the value
    if (category === "toRead" && category === shelfItem?.category) {
      handleDataSubmit();
    } else if (category === shelfItem?.category) {
      setStep(3);
    }
  };

  const handleReviewCreation = (reviewObject: any) => {
    setBookshelfItem({
      ...bookshelfItem,
      review: {
        ...bookshelfItem.review,
        review: reviewObject.review,
        rating: reviewObject.rating,
      },
    });
  };

  useEffect(() => {
    if (!open) {
      setBookshelfItem(null);
      setStep(1);
    }
  }, [open]);

  useEffect(() => {
    if (bookshelfItem?.category === "toRead" && step === 2) {
      handleDataSubmit();
    } else if (step === 2) {
      setStep(3);
    }
  }, [bookshelfItem?.category]);

  useEffect(() => {
    if (bookshelfItem?.review && step === 3) {
      handleDataSubmit();
    }
  }, [bookshelfItem.review]);

  const handleDataSubmit = async () => {
    //Save the object accordingly.
    await updateUserBookshelf(bookshelfItem, userId, pathname);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handClose}>
      <DialogContent className="sm:focus-within:top-2/4 focus-within:-translate-y-80 duration-300 ease-in-out">
        <DialogHeader>
          <DialogTitle className="text-base-semibold  text-slate-700 dark:text-gray-300">
            {step === 1 && "Add book"}
            {step === 2 && "Add category"}
            {step === 3 && "Add rating"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 &&
              `Enter book details. Click save when you're done to add book to your
            shelf.`}
            {step === 2 && `Select the category for the book.`}
            {step === 3 && `Rate the book and add a review.`}
          </DialogDescription>
        </DialogHeader>
        {step === 1 && (
          <BookshelfBook
            book={bookshelfItem?.book}
            onSubmit={handleBookSelection}
            back={handleClose}
          />
        )}
        {step === 2 && (
          <BookshelfType
            back={() => setStep(1)}
            category={bookshelfItem?.category}
            onSubmit={handleCategorySelection}
          />
        )}
        {step === 3 && (
          <BookshelfRating
            back={() => setStep(2)}
            reviewObject={bookshelfItem?.review}
            onSubmit={handleReviewCreation}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookshelfItem;
