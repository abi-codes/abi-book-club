"use client";

import FollowersListCard from "@/components/cards/activity-cards/followers-list-card";
import {
  appproveFollowRequest,
  declineFollowRequest,
  fetchUserFollowRequests,
} from "@/lib/actions/user.actions";
import { IClubUser, IFollowUser } from "@/lib/types/user";
import React, { useState } from "react";

interface Props {
  userId: string;
  initialRequests: IFollowUser[];
  initialHasNext: boolean;
}

const FollowersList = ({ userId, initialRequests, initialHasNext }: Props) => {
  const [followerRequestList, setFollowerRequestList] =
    useState<IFollowUser[]>(initialRequests);

  const [hasNext, setHasNext] = useState(initialHasNext);

  const rejectMemeberRequest = async (requestId: string) => {
    await declineFollowRequest(userId, requestId);
    setFollowerRequestList(
      followerRequestList.filter((request) => request._id !== requestId)
    );

    //Fetch a the next record if there is one
    if (hasNext) {
      //fetch next record and add to the list
      const followersResponse = await fetchUserFollowRequests({
        userId: userId,
        pageNumber: 1,
        pageSize: 1,
      });

      setFollowerRequestList([
        ...followerRequestList,
        ...followersResponse.users,
      ]);
    }
  };

  const approveMemberRequest = async (requestId: string) => {
    await appproveFollowRequest(userId, requestId);
    setFollowerRequestList(
      followerRequestList.filter((request) => request._id !== requestId)
    );

    //Fetch a the next record if there is one
    if (hasNext) {
      //fetch next record and add to the list
      const followersResponse = await fetchUserFollowRequests({
        userId: userId,
        pageNumber: 1,
        pageSize: 1,
      });

      setFollowerRequestList([
        ...followerRequestList,
        ...followersResponse.users,
      ]);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {followerRequestList &&
        followerRequestList.map((user) => (
          <FollowersListCard
            request={user}
            approve={(res) => approveMemberRequest(res)}
            decline={(res) => rejectMemeberRequest(res)}
          />
        ))}
    </div>
  );
};

export default FollowersList;
