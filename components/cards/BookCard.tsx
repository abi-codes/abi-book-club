import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "../ui/alert-dialog";
import { useState } from "react";
import Rating from "../custom-ui/RatingInput";

interface Props {
  book: {
    id: string;
    title: string;
    authors: string[];
    cover: string;
  };
  review: any;

  handleSelectItem: () => void;
  handleViewItem: () => void;
  handleDeleteItem: () => void;
  isOwner: boolean;
}

const BookCard = ({
  book,
  review,
  handleSelectItem,
  handleViewItem,
  handleDeleteItem,
  isOwner,
}: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <article className="w-40">
      {!isOwner ? (
        <div className="flex flex-col" onClick={() => handleViewItem()}>
          <div
            // onClick={() => handleSelectItem()}
            className="relative w-full h-40 
              lg:h-60 overflow-hidden cursor-pointer"
          >
            <Image
              src={book.cover}
              alt={book.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex justify-between items-center gap-2 cursor-pointer">
            <div className="flex flex-col">
              <h3
                className="text-small-semibold lg:text-base-semibold h-11 w-10/12 
              text-black dark:text-light-1 mt-2 overflow-hidden text-ellipsis"
              >
                {book.title.substring(0, 30)}
                {book.title.length > 20 && "..."}
              </h3>
              <p
                className="text-subtle-semibold lg:text-small-regular text-black 
              dark:text-light-1 h-5 w-10/12 overflow-hidden  text-ellipsis"
              >
                {book.authors.map((a) => a)}
              </p>
              {review?.rating && <Rating defaultRating={review?.rating} />}
            </div>
          </div>
        </div>
      ) : (
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <div className="flex flex-col">
            <DropdownMenuTrigger asChild>
              <div
                // onClick={() => handleSelectItem()}
                className="relative w-full h-40 lg:h-60 
                           overflow-hidden cursor-pointer"
              >
                <Image
                  src={book?.cover}
                  alt={book.title}
                  fill
                  className="object-contain"
                />
              </div>
            </DropdownMenuTrigger>
            <div className="flex justify-between items-center gap-2 cursor-pointer">
              <div className="flex flex-col">
                <h3 className="text-small-semibold lg:text-base-semibold h-11 w-10/12 text-black dark:text-light-1 mt-2 overflow-hidden text-ellipsis">
                  {book.title.substring(0, 30)}
                  {book.title.length > 30 && "..."}
                </h3>
                <p
                  className="text-subtle-semibold lg:text-small-regular text-black 
                            dark:text-light-1 h-4 w-10/12 overflow-hidden text-ellipsis"
                >
                  {book.authors.join(", ")}
                </p>
                {review?.rating && (
                  <div className="mt-2 w-3/4 ">
                    <Rating defaultRating={review?.rating} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DropdownMenuContent>
            <DropdownMenuLabel
              className="cursor-pointer"
              onClick={() => {
                setDropdownOpen(false);
                handleViewItem();
              }}
            >
              View
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel
              className="cursor-pointer"
              onClick={() => {
                setDropdownOpen(false);
                handleSelectItem();
              }}
            >
              Edit
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuLabel className="cursor-pointer text-red-600">
                  Delete
                </DropdownMenuLabel>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this book from your shelf?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDropdownOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleDeleteItem();
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </article>
  );
};

export default BookCard;
