import FollowersCard from "@/components/cards/activity-cards/followers-card";
import React from "react";

interface Props {
  _userId: string;
}

const Followers = ({ _userId }: Props) => {
  return <FollowersCard _userId={_userId} />;
};

export default Followers;
