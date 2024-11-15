"use client";
import { Button } from "@/components/ui/button";
import {
  appproveFollowRequest,
  declineFollowRequest,
} from "@/lib/actions/user.actions";
import { IFollowUser } from "@/lib/types/user";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  request: IFollowUser;
  approve: (requestId: string) => void;
  decline: (requestId: string) => void;
}

const FollowersListCard = ({ request, approve, decline }: Props) => {
  const router = useRouter();

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="relative h-12 w-12">
          <img
            src={request.image}
            alt="user_logo"
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-black dark:text-light-1">
            {request.name} {request.surname}
          </h4>
          <p className="text-small-medium text-gray-1">@{request.username}</p>
        </div>
      </div>

      <Button
        className="user-card_btn"
        onClick={() => {
          router.push(`/profile/${request._id}`);
        }}
      >
        View
      </Button>
      <Button
        className="user-card_btn"
        variant="destructive"
        onClick={() => decline(request._id)}
      >
        Reject
      </Button>
      <Button
        className="user-card_btn bg-green-800"
        onClick={() => approve(request.id)}
      >
        Accept
      </Button>
    </article>
  );
};

export default FollowersListCard;
