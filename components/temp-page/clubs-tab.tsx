import React from "react";
import ClubDetails from "../forms/ClubDetails";
import PendingRequest from "../forms/PendingRequest";
import { IUser } from "@/lib/types/user";

interface Props {
  user: IUser;
}

const ClubsTab = ({ user }: Props) => {
  return (
    <div className="flex flex-col gap-8">
      <ClubDetails userId={user.id} _userId={user._id} />
      <PendingRequest userId={user.id} _userId={user._id} />
    </div>
  );
};

export default ClubsTab;
