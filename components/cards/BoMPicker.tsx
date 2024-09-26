import { IBookSession } from "@/lib/types/bookSession";
import React, { useState } from "react";
import { Button } from "../ui/button";

interface Props {
  bookSessions: IBookSession[];
  handleSubmit: (bookSession: IBookSession) => void;
}
const BoMPicker = ({ bookSessions, handleSubmit }: Props) => {
  const [selectedBook, setSelectedBook] = useState<IBookSession>(
    bookSessions[0]
  );

  const onSubmit = () => {
    if (selectedBook) {
      handleSubmit(selectedBook);
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-3 items-center">
        {bookSessions.map((bookSession) => (
          <div
            key={bookSession._id}
            onClick={() => setSelectedBook(bookSession)}
          >
            {selectedBook.id === bookSession.id && (
              <div className="text-center">Winner</div>
            )}
            <div
              className={`relative h-32 w-20 sm:h-40 
           sm:w-28 cursor-pointer ${
             selectedBook.id === bookSession.id ? "drop-shadow-lg" : ""
           }`}
            >
              <img
                src={bookSession.bookId.cover}
                alt={bookSession.bookId.title}
                className="relative h-32 w-20 sm:h-40 
           sm:w-28"
              />
            </div>
            <div className="mt-2">
              <p
                className="sm:text-center text-small-semibold lg:text-base-semibold 
    h-11 text-black dark:text-light-1 mt-2 
    overflow-hidden text-ellipsis"
              >
                {bookSession.bookId.title}
              </p>
              <p
                className="sm:text-center text-small-semibold  
    h-11 text-black dark:text-light-1 mt-2 
    overflow-hidden text-ellipsis"
              >
                {bookSession.bookId.authors.join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={() => onSubmit()}>Submit</Button>
    </div>
  );
};

export default BoMPicker;
