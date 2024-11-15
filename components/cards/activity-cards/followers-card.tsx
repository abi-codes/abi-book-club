"use client";

import { fetchUserFollowRequests } from "@/lib/actions/user.actions";
import { IFollowUser } from "@/lib/types/user";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  _userId: string;
  onClick?: () => void;
  initialRequests: IFollowUser[];
}

const FollowersCard = ({ _userId, initialRequests, onClick }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [followRequests, setFollowRequests] =
    useState<IFollowUser[]>(initialRequests);

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    fetchUserFollowRequests({
      userId: _userId,
      pageNumber: 1,
    })
      .then((response) => {
        setFollowRequests(response.users);
        // setTotalPages(response.totalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user request list", error);
      });
  }, []);

  return (
    followRequests.length > 0 && (
      <div
        className={`flex flex-row items-center 
        justify-between px-7 py-4  border-b-2 cursor-pointer`}
        onClick={() => onClick && onClick()}
      >
        <div className="flex flex-row gap-1">
          <div className="flex relative">
            {followRequests.map((follower, index) => {
              return (
                index < 4 && (
                  <img
                    key={index}
                    src={follower.image}
                    alt={`${follower.name} profile image`}
                    width={40}
                    height={40}
                    className="rounded-full object-cover -ml-2.5 
                    bg-dark-2 border-2 border-dark-2"
                  />
                )
              );
            })}
          </div>
          <p className="mt-1 !text-small-regular text-black dark:text-white">
            <span className="text-red-800">{followRequests[0].name} </span>{" "}
            {followRequests.length > 1 && "and others"} requested to follow you
          </p>
        </div>
        <div>{">"}</div>
      </div>
    )
  );
};

export default FollowersCard;
