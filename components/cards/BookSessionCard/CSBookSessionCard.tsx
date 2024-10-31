import { handleSessionVote } from "@/lib/actions/bom.action";
import { IBookSession } from "@/lib/types/bookSession";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  queueId: string;
  bookSession: IBookSession;
  userId: string;
  handleView: (book: any) => void;
  handleAdd: (book: any) => void;
  handleVote: (bookSession: any) => void;
}

const CSBookSessionCard = ({
  bookSession,
  userId,
  queueId,
  handleView,
  handleAdd,
  handleVote,
}: Props) => {
  const hasVoted = bookSession.votes.some((x: any) => x == userId);
  return (
    <div
      className="flex flex-row gap-4 sm:flex-col 
    items-center cursor-pointer 
    relative"
    >
      <div
        className="relative h-32 w-20 sm:h-40 sm:w-28"
        onClick={() => handleAdd(bookSession)}
      >
        <img src={bookSession.bookId.cover} alt={bookSession.bookId.title} />
      </div>
      <div className="mt-2 w-40">
        <p
          className="sm:text-center text-small-semibold lg:text-base-semibold 
    h-11 text-black dark:text-light-1 mt-2 
    overflow-hidden text-ellipsis"
        >
          {bookSession.bookId.title}
        </p>
        <p
          className="text-xs sm:text-center 
    text-black dark:text-light-1"
        >
          {bookSession.bookId.authors[0]}
        </p>
        <div className="flex justify-between sm:justify-around mt-2">
          <div className="flex gap-1">
            <div
              className="cursor-pointer"
              onClick={() => handleVote(bookSession.id)}
            >
              {hasVoted ? (
                <img src="/assets/heart-filled.svg" alt="heart" />
              ) : (
                <img src="/assets/heart-gray.svg" alt="heart" />
              )}
            </div>
            <p className="text-xs text-black dark:text-light-1">
              {bookSession.votes.length}
            </p>
          </div>
          <div className="flex">
            <div
              className="cursor-pointer"
              onClick={() => handleView(bookSession.bookId)}
            >
              <img src="/assets/eye.svg" alt="eye" width={25} height={25} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSBookSessionCard;
