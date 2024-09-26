"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import BomQueueSelection from "./BomQueueSelection";
import BookshelfBook from "./BookshelfBook";
import BomQueueSchedule from "./BomQueueSchedule";
import { addBookQueueToCommunity } from "@/lib/actions/community.actions";
import CommunitySelection from "./CommunitySelection";
import { IBomQueue } from "@/lib/types/bomQueue";

interface Props {
  open: boolean;
  userId: string;
  communityId?: string;
  selectedQueue?: IBomQueue;
  reloadQueue?: () => void;
  handleClose: () => void;
}

const BomQueue = ({
  open,
  userId,
  communityId,
  selectedQueue,
  reloadQueue,
  handleClose,
}: Props) => {
  //   const [open, setOpen] = useState(false);

  const [currentQueue, setCurrentQueue] = useState<any>(
    selectedQueue ? selectedQueue.bookSessions : [null, null, null]
  );
  const [currentCommunityId, setCurrentCommunityId] = useState(
    communityId ? communityId : null
  );
  const [votingDate, setVotingDate] = React.useState<any | undefined>({
    from: null,
    to: null,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentView, setCurrentView] = useState<any>(
    communityId ? "queue" : "community"
  );

  const beforeClose = () => {
    handleClose();
  };

  const back = () => {
    switch (currentView) {
      case "queue":
        setCurrentView("community");
        break;
      case "schedule":
        setCurrentView("queue");
        break;
      case "add":
        setCurrentView("queue");
        break;
      default:
        break;
    }
  };

  const handleAddToQueue = (index: number) => {
    setSelectedIndex(index);
    setCurrentView("add");
  };

  const handleRemoveFromQueue = (index: number) => {
    const newQueue = currentQueue;
    newQueue[index] = null;
    setCurrentQueue(newQueue);
  };

  const handleSubmitCommunity = () => {
    setCurrentView("queue");
  };

  const handleBookSelection = (book: any) => {
    const newQueue = currentQueue;
    newQueue[selectedIndex] = book;
    setCurrentQueue(newQueue);
    setCurrentView("queue");
  };

  const handleSubmitQueue = () => {
    // create new queue move to next step
    setCurrentView("schedule");
  };

  const handleSelectCommunityId = (communityId: string) => {
    setCurrentCommunityId(communityId);
  };

  const handleSubmitSchedule = async (startDate: Date, endDate: Date) => {
    // create new queue or update schedule if existing
    setVotingDate({ from: startDate, to: endDate });

    await addBookQueueToCommunity(
      currentCommunityId ? currentCommunityId : "",
      currentQueue,
      startDate,
      endDate,
      "/"
    );

    if (reloadQueue) {
      reloadQueue();
    }

    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={beforeClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Queue</DialogTitle>
          <DialogDescription>
            Create a queue for members of your club to pick a book of the month
          </DialogDescription>
        </DialogHeader>
        {currentView === "community" && (
          <CommunitySelection
            userId={userId}
            currentCommunityId={currentCommunityId ? currentCommunityId : ""}
            selectCommunity={(community) => handleSelectCommunityId(community)}
            next={() => handleSubmitCommunity()}
          />
        )}
        {currentView === "queue" && (
          <BomQueueSelection
            currentQueue={currentQueue}
            handleRemoveQueue={(index) => handleRemoveFromQueue(index)}
            handleAddQueue={(index) => handleAddToQueue(index)}
            next={() => handleSubmitQueue()}
            back={() => back()}
          />
        )}

        {currentView === "schedule" && (
          <BomQueueSchedule
            next={async (startDate, endDate) =>
              await handleSubmitSchedule(startDate, endDate)
            }
            back={() => back()}
          />
        )}

        {currentView === "add" && (
          <BookshelfBook
            book={currentQueue[selectedIndex]}
            onSubmit={(book) => {
              handleBookSelection(book);
            }}
            back={() => back()}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BomQueue;
