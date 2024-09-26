"use client";

import { ICommunity } from "@/lib/types/community";
import React, { useState } from "react";

import ClubCard from "../cards/ClubCard";
import CarouselCard from "../cards/CarouselCard";
import ProfileCard from "../cards/ProfileCard";
import { Button } from "../ui/button";

interface Props {
  communities: ICommunity[];
  users?: any[];
}

const CollapsableSidebar = ({ communities, users }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <section
      className={`custom-scrollbar rightsidebar duration-300 ease-in-out sticky`}
    >
      <div className="flex flex-col gap-[3rem] w-60">
        <div className="flex flex-1 flex-col justify-start">
          <h3 className="text-heading4-medium text-black dark:text-light-1">
            Suggested Clubs
          </h3>
          <div className="flex flex-col gap-3.5 justify-center mt-2.5">
            {communities.map((community) => (
              <ClubCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </div>
        </div>
        {/* <div className="flex flex-1 flex-col justify-start">
          <h3 className="text-heading4-medium text-black dark:text-light-1 mb-2">
            Suggested Readers
          </h3>

          <CarouselCard>
            {users.map((user: any, index: number) => (
              <ProfileCard
                id={index + 1}
                userId={user.id}
                imgUrl={user.image}
                name={user.name}
                username={user.username}
                key={user._id}
                personType=""
                bio={user.bio}
              />
            ))}
          </CarouselCard>
        </div> */}
      </div>
    </section>
  );
};

export default CollapsableSidebar;
