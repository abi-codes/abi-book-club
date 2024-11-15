import React from "react";
import FollowRequests from "../forms/FollowRequests";
import { IUser } from "@/lib/types/user";

interface Props {
  user: IUser;
}

const FollowersTab = ({ user }: Props) => {
  return (
    <div className="flex flex-col gap-8">
      <FollowRequests _userId={user._id} />
    </div>
  );
};

export default FollowersTab;
