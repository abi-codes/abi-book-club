"use client";

import React, { use, useEffect, useState } from "react";
import BookSessionCard from "./BookSessionCard";
import BookView from "./BookView";
import { IBomQueue } from "@/lib/types/bomQueue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  deleteQueue,
  publishBookQueue,
  startReadingBookQueue,
  updateBookInQueue,
  updateQueueSchedule,
} from "@/lib/actions/community.actions";
import { IBookSession } from "@/lib/types/bookSession";
import BomQueueSchedule from "../forms/BomQueueSchedule";
import BookAdd from "../forms/BookAdd";
import { Button } from "../ui/button";
import ValidationModal from "../modals/validation-modal/validation-modal";
import StartReadingModal from "../modals/start-reading-modal/start-reading-modal";
import PublishModal from "../modals/publish-modal/publish-modal";
import CSBookSessionCard from "./BookSessionCard/CSBookSessionCard";
import { handleSessionVote } from "@/lib/actions/bom.action";
import { useRouter } from "next/navigation";

interface Props {
  queue: IBomQueue;
  userId: string;
  reloadQueue?: () => void;
  isOwner?: boolean;
}

const BoMQueueCard = ({ queue, userId, reloadQueue, isOwner }: Props) => {
  //Check if the current user has voted for the book session
  const router = useRouter();
  const [currentQueue, setCurrentQueue] = useState<IBomQueue>(queue);
  const [showView, setShowView] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [publishConfirm, setPublishConfirm] = useState(false);
  const [publishError, setPublishError] = useState(false);
  const [publishErrorMessage, setPublishErrorMessage] = useState("");
  const [publishErrorTitle, setPublishErrorTitle] = useState("");
  const [startReadingConfirm, setStartReadingConfirm] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [currentBook, setBook] = useState<IBookSession>();
  const [mostVoted, setMostVoted] = useState<IBookSession[]>();
  const [isLoading, setIsLoading] = useState(false);

  const handleBookChangeView = (book: any) => {
    if (isOwner) {
      setBook(book);
      setShowAdd(true);
    } else {
      handleSetView(book?.bookId);
    }
  };

  const handleCloseBookChange = () => {
    setShowAdd(false);
  };

  const handleCloseDateView = () => {
    setShowDate(false);
  };

  const handleSetView = (book: any) => {
    setBook(book);
    setShowView(true);
  };

  const handleCloseView = () => {
    setShowView(false);
  };

  const onSubmitChangeBook = async (book: any) => {
    //update the bomQueue with the new book.
    await updateBookInQueue(currentQueue.id, currentBook?._id, book);

    //Close the dialog
    handleCloseBookChange();

    if (reloadQueue) {
      //Reload the shelf
      reloadQueue();
    }
  };

  const onSubmitChangeSchedule = async (startDate: Date, endDate: Date) => {
    //update the bomQueue with the new book.
    await updateQueueSchedule(currentQueue.id, startDate, endDate);

    //Close the dialog
    handleCloseDateView();

    if (reloadQueue) {
      //Reload the shelf
      reloadQueue();
    }
  };

  const publishQueue = async (publishThread?: string) => {
    setIsLoading(true);

    await publishBookQueue(currentQueue.id, userId, publishThread);

    if (reloadQueue) {
      //Reload the shelf
      reloadQueue();
    }

    setIsLoading(false);
  };

  const publishValidation = () => {
    if (currentQueue.startDate === null || currentQueue.endDate === null) {
      //They have not set the dates
      setPublishError(true);
      setPublishErrorTitle("Please set the dates");
      setPublishErrorMessage(
        "You must set the start and end dates for the queue before publishing."
      );
      return;
    }

    if (currentQueue.bookSessions.length !== 3) {
      //They have not selected all the books
      setPublishError(true);
      setPublishErrorTitle("Please select all the books");
      setPublishErrorMessage(
        "You must select all the books for the queue before publishing."
      );
      return;
    }

    if (currentQueue.endDate < new Date()) {
      //They have no time to vote
      setPublishError(true);
      setPublishErrorTitle("Invalid voting period");
      setPublishErrorMessage(
        "Your club members will not have enough time to vote. Please select a valid date range."
      );
      return;
    }

    if (currentQueue.startDate < new Date()) {
      currentQueue.status = "Voting";
    }

    setPublishConfirm(true);
  };

  const startReadingValidation = () => {
    // If there are two books with the same amount of votes both should be pushed to the state array mostVoted
    let mostVotedBooks: IBookSession[] = [];
    let maxVotes = 0;

    for (var bookSession of currentQueue.bookSessions) {
      if (bookSession.votes.length > maxVotes) {
        mostVotedBooks = [bookSession];
        maxVotes = bookSession.votes.length;
      } else if (bookSession.votes.length === maxVotes) {
        mostVotedBooks.push(bookSession);
      }
    }

    setMostVoted(mostVotedBooks);

    setStartReadingConfirm(true);
  };

  const handleStartReading = async (
    bookSession: IBookSession,
    startDate: Date,
    endDate: Date
  ) => {
    setIsLoading(true);

    await startReadingBookQueue(
      currentQueue.id,
      bookSession._id,
      startDate,
      endDate
    );

    if (reloadQueue) {
      //Reload the shelf
      reloadQueue();
    }

    setIsLoading(false);
  };

  const handleDeleteQueue = async () => {
    setIsLoading(true);

    await deleteQueue(currentQueue.id);

    if (reloadQueue) {
      //Reload the shelf
      reloadQueue();
    }

    setIsLoading(false);
  };

  const deleteValidation = () => {
    if (currentQueue.status != "Completed") {
      setDeleteConfirm(true);
    }
  };

  const handleBookVote = async (bookSession: any) => {
    if (!userId || userId.trim() === "") {
      router.push("/sign-in");
      return;
    }
    //if the user has already voted for another book session in the queue, remove the vote
    const bookSessions = currentQueue.bookSessions;

    for (var book of bookSessions) {
      //If he voted for another book remove it

      if (book.votes.find((x: any) => x == userId) && book.id != bookSession) {
        book.votes = book.votes.filter((vote: any) => vote != userId);
      }

      //If he voted for this book remove it
      if (book.votes.find((x) => x == userId) && book.id == bookSession) {
        book.votes = book.votes.filter((vote: any) => vote != userId);
      }

      //if he has not voted for any book add the vote for his book
      if (!book.votes.find((x) => x == userId) && book.id == bookSession) {
        book.votes.push(userId);
      }
    }

    setCurrentQueue({ ...currentQueue, bookSessions: bookSessions });

    await handleSessionVote(currentQueue.id, bookSession, userId, "/");
  };

  return (
    <div className="flex flex-col">
      <div
        className="flex items-center gap-1 justify-center"
        onClick={() => {
          isOwner && setShowDate(true);
        }}
      >
        <p>
          {currentQueue.startDate
            ? new Date(currentQueue.startDate).toDateString()
            : "Select start date"}
        </p>
        <p> to </p>
        <p>
          {currentQueue.endDate
            ? new Date(currentQueue.endDate).toDateString()
            : "Select end date"}
        </p>
      </div>
      <div
        className="flex flex-col overflow-hidden relative 
      sm:grid sm:grid-cols-3 gap-12 p-8"
      >
        <div
          className="absolute flex shadow-md items-center top-4 -right-4
         bg-purple-300 h-4 w-20 z-50 m-auto rotate-45"
        >
          <p className="text-white text-subtle-medium  text-center w-full">
            {currentQueue.status}
          </p>
        </div>
        {currentQueue.communityId && currentQueue.communityId.image && (
          <div
            className="absolute top-0 left-0 z-50 
        rounded-full h-14 w-14  bg-white"
          >
            <img
              src={currentQueue.communityId?.image}
              alt={currentQueue.communityId?.id}
              className="object-cover rounded-full h-14 w-14"
            />
          </div>
        )}
        {currentQueue.bookSessions.map((item: any, index: number) => {
          return (
            <CSBookSessionCard
              key={index}
              bookSession={item}
              userId={userId}
              queueId={currentQueue.id}
              handleView={handleSetView}
              handleAdd={(book: any) => handleBookChangeView(book)}
              handleVote={(bookSession: any) => handleBookVote(bookSession)}
            />
          );
        })}
        {showView && (
          <BookView
            open={showView}
            book={currentBook}
            handleClose={handleCloseView}
          />
        )}

        <Dialog open={showDate} onOpenChange={handleCloseDateView}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Queue</DialogTitle>
              <DialogDescription>
                Create a queue for members of your club to pick a book of the
                month
              </DialogDescription>
            </DialogHeader>
            <BomQueueSchedule
              schedule={{
                from: currentQueue.startDate,
                to: currentQueue.endDate,
              }}
              back={() => handleCloseBookChange()}
              next={async (startDate, endDate) =>
                await onSubmitChangeSchedule(startDate, endDate)
              }
            />
          </DialogContent>
        </Dialog>

        {showAdd && (
          <BookAdd
            open={showAdd}
            close={() => setShowAdd(false)}
            currentBook={currentBook?.bookId}
            onSubmitBook={(book: any) => onSubmitChangeBook(book)}
          />
        )}
      </div>
      <div className="flex items-center justify-center gap-2">
        {isOwner && currentQueue.status === "Voting" && (
          <Button
            onClick={() => startReadingValidation()}
            className="text-center cursor-pointer w-auto p-6"
          >
            Start reading
          </Button>
        )}
        {isOwner && currentQueue.status === "Draft" && (
          <Button
            onClick={() => publishValidation()}
            className="text-center cursor-pointer w-auto p-6"
          >
            Publish
          </Button>
        )}
        {isOwner && (
          <Button
            onClick={() => deleteValidation()}
            className="text-center cursor-pointer w-auto p-6"
          >
            Delete
          </Button>
        )}
      </div>
      {mostVoted && mostVoted.length > 0 && (
        <StartReadingModal
          open={startReadingConfirm}
          close={() => setStartReadingConfirm(false)}
          bookSessions={mostVoted}
          handleSubmit={(book: IBookSession, startDate: Date, endDate: Date) =>
            handleStartReading(book, startDate, endDate)
          }
        />
      )}

      <ValidationModal
        open={deleteConfirm}
        close={() => setDeleteConfirm(false)}
        handleSubmit={() => handleDeleteQueue()}
        validationDescription="This will delete the queue and all its contents."
        validationTitle="Are you absolutely sure?"
        cancellationText="Cancel"
        submitText="Delete"
      />

      <PublishModal
        open={publishConfirm}
        close={() => setPublishConfirm(false)}
        handleSubmit={(publishThread) => publishQueue(publishThread)}
      />

      <ValidationModal
        open={publishError}
        close={() => setPublishError(false)}
        handleSubmit={() => setPublishError(false)}
        validationDescription={publishErrorMessage}
        validationTitle={publishErrorTitle}
        cancellationText={`Close`}
        submitText={`Ok`}
      />
    </div>
  );
};

export default BoMQueueCard;
