import { IBom } from "@/lib/types/bom";
import { IBook } from "@/lib/types/book";
import Link from "next/link";
import React from "react";

interface Props {
  bom: IBom;
  handleView: (book: IBook) => void;
}

const BoMCard = ({ bom }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative h-32 w-20 sm:h-40 sm:w-28">
        <img
          src={bom.bookSession.bookId.cover}
          alt={bom.bookSession.bookId.title}
        />
      </div>
      <div className="mt-2 w-40">
        <p
          className="sm:text-center text-small-semibold lg:text-base-semibold 
    h-11 text-black dark:text-light-1 mt-2 
    overflow-hidden text-ellipsis"
        >
          {bom.bookSession.bookId.title}
        </p>
        <p
          className="text-xs sm:text-center 
    text-black dark:text-light-1"
        >
          {bom.bookSession.bookId.authors[0]}
        </p>
      </div>
      <div className="flex justify-between sm:justify-between mt-2 w-28">
        <div className="flex">
          <div className="cursor-pointer">
            <img src="/assets/heart-filled.svg" alt="heart" />
          </div>
          <p className="text-xs text-black dark:text-light-1">
            {bom.bookSession.votes.length}
          </p>
        </div>
        <div className="flex">
          <Link
            href={`/books/${bom.bookSession.bookId.id}`}
            passHref
            className="cursor-pointer"
          >
            <img src="/assets/eye.svg" alt="eye" width={25} height={25} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BoMCard;
