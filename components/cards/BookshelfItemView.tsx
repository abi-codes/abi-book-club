import {} from "@radix-ui/react-dialog";
import React from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import Rating from "../custom-ui/RatingInput";
import { Separator } from "../ui/separator";

interface Props {
  open: boolean;
  shelfItem: any | null;
  handleClose: () => void;
}

const BookshelfItemView = ({ open, shelfItem, handleClose }: Props) => {
  console.log("ShelfItem", shelfItem);
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="gap-2">
        <div className="grid grid-cols-[1fr,2fr] gap-2 m-2">
          <div className="flex flex-col rounded-md justify-start items-start overflow-hidden">
            <Image
              src={shelfItem?.book?.cover}
              alt={shelfItem?.book?.title}
              height={96}
              width={80}
              className="object-contain"
            />
            <div className="mt-4 ">
              <h2 className="text-subtle-semibold font-semibold leading-none tracking-tight h-6 overflow-hidden">
                {shelfItem?.book?.title.substring(0, 40)}
                {shelfItem?.book?.title.length > 20 && "..."}
              </h2>
              <p className="text-subtle-medium text-slate-500 dark:text-slate-400 h-8 overflow-hidden">
                {shelfItem?.book?.authors.join(", ")}
              </p>
            </div>
          </div>
          {shelfItem?.book?.description && (
            <div
              className="text-subtle-semibold lg:text-small-regular 
              text-black dark:text-light-1"
              dangerouslySetInnerHTML={{
                __html: shelfItem?.book.description.slice(0, 400) + `${"..."}`,
              }}
            ></div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Separator />
          {shelfItem?.book?.categories && (
            <p
              className="text-subtle-semibold text-center 
            lg:text-small-regular text-black dark:text-light-1"
            >
              {shelfItem?.book?.categories[0]}
            </p>
          )}
          {shelfItem?.review && (
            <>
              <Separator />
              <div className="grid grid-cols-[1fr,4fr]">
                <div className="relative h-10 w-10 object-cover">
                  <Image
                    src={
                      shelfItem?.review?.createdBy?.image || "/images/user.png"
                    }
                    alt="Profile image"
                    fill
                    className="rounded-full object-cover shadow-2xl"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  {shelfItem?.review?.rating && (
                    <Rating defaultRating={shelfItem?.review?.rating} />
                  )}
                  {shelfItem?.review?.review && (
                    <p className="text-subtle-semibold lg:text-small-regular h-16  dark:text-light-1 overflow-y-auto ">
                      {shelfItem?.review?.review}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookshelfItemView;
