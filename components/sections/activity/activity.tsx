"use client";

import React, { useState } from "react";
import ActivityList from "./activity-list";
import FollowersCard from "@/components/cards/activity-cards/followers-card";
import FollowersList from "./followers-list";
import { IFollowUser } from "@/lib/types/user";
import { Button } from "@/components/ui/button";

interface Props {
  userId: string;
  initialActivity: any[];
  initialRequests: IFollowUser[];
  initialHasRequestsNext: boolean;
}

const Activity = ({
  userId,
  initialActivity,
  initialRequests,
  initialHasRequestsNext,
}: Props) => {
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);

  return (
    <section>
      {!isFollowersOpen ? (
        <>
          <h1 className="head-text text-black dark:text-white leading-none mb-1">
            Catch up with
            <br />
            your Journal
          </h1>
          <h1 className="head-text cursive">Entries</h1>
          <img
            src="\assets\underline.png"
            alt="Text Underline"
            width="110px"
            height="10px"
            className="underline"
          ></img>
        </>
      ) : (
        <div className="flex gap-1 items-center">
          <Button onClick={() => setIsFollowersOpen(false)}>{"<"}</Button>
          <div>
            <h1 className="head-text text-black dark:text-white leading-none mb-1">
              Catch up with your audience
            </h1>
            <h1 className="head-text cursive">Follow requests</h1>
            <img
              src="\assets\underline.png"
              alt="Text Underline"
              width="110px"
              height="10px"
              className="underline"
            ></img>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-5">
        {!isFollowersOpen ? (
          <>
            <FollowersCard
              _userId={userId}
              initialRequests={initialRequests}
              onClick={() => setIsFollowersOpen(true)}
            />
            <ActivityList activity={initialActivity} />
          </>
        ) : (
          <FollowersList
            userId={userId}
            initialRequests={initialRequests}
            initialHasNext={initialHasRequestsNext}
          />
        )}
      </div>
    </section>
  );
};

export default Activity;
