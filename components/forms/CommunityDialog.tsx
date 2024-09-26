import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import Community from "./Community";
import { ICommunity } from "@/lib/types/community";

interface Props {
  community: ICommunity | null;
  open: boolean;
  handleClose: () => void;
  userId: string;
}
const CommunityDialog = ({ userId, open, community, handleClose }: Props) => {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="content-center sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add book club</DialogTitle>
          <DialogDescription>
            Add your book club. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Community
          community={{
            id: community ? community.id : "",
            username: community ? community.username : "",
            name: community ? community.name : "",
            image: community ? community.image : "",
            bio: community ? community.bio : "",
            ownerUserId: userId,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CommunityDialog;
