import React from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { Separator } from "../ui/separator";

interface Props {
  open: boolean;
  book: any | null;
  handleClose: () => void;
}

const BookView = ({ open, book, handleClose }: Props) => {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="gap-2">
        <div className="grid grid-cols-[1fr,2fr] gap-2 m-2">
          <div className="flex flex-col rounded-md justify-start items-start overflow-hidden">
            <Image
              src={book?.cover}
              alt={book?.title}
              height={96}
              width={80}
              className="object-contain"
            />
            <div className="mt-4 ">
              <h2 className="text-subtle-semibold font-semibold leading-none tracking-tight h-6 overflow-hidden">
                {book?.title.substring(0, 40)}
                {book?.title.length > 20 && "..."}
              </h2>
              <p className="text-subtle-medium text-slate-500 dark:text-slate-400 h-8 overflow-hidden">
                {book?.authors.join(", ")}
              </p>
            </div>
          </div>
          {book?.description && (
            <div
              className="text-subtle-semibold lg:text-small-regular 
              text-black dark:text-light-1"
              dangerouslySetInnerHTML={{
                __html: book.description.slice(0, 400) + `${"..."}`,
              }}
            ></div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Separator />
          {book?.categories && (
            <p
              className="text-subtle-semibold text-center 
            lg:text-small-regular text-black dark:text-light-1"
            >
              {book?.categories[0]}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookView;
