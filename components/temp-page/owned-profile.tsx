"use client";

import React, { use, useEffect, useState } from "react";
import ProfileTopbar from "../shared/ProfileTopbar";
import Profile from "./profile";
import { IUser } from "@/lib/types/user";
import GeneralTab from "./general-tab";
import ProfileDetails from "../forms/ProfileDetails";
import ProfileTab from "./profile-tab";
import BookshelfTab from "./bookshelf-tab";
import BomTab from "./bom-tab";
import ClubsTab from "./clubs-tab";
import { useRouter, useSearchParams } from "next/navigation";
import FollowersTab from "./followers-tab";

interface Props {
  id: string;
  userInfo: IUser;
  isOwner: boolean;
  isFollowing: boolean;
}

const OwnedProfile = ({ id, userInfo, isOwner, isFollowing }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState(
    searchParams.get("tab") ? (searchParams.get("tab") as string) : "General"
  );

  useEffect(() => {
    if (searchParams.get("tab")) {
      setCurrentTab(searchParams.get("tab") as string);
    }
  }, []);

  const handleSetTab = (currentTab: string) => {
    //set a query parameter to the url
    router.push(`/profile/${id}?tab=${currentTab}`);
    setCurrentTab(currentTab);
  };
  return (
    <div className="flex-1 flex-col w-full">
      <ProfileTopbar
        defaultValue={currentTab}
        setCurrentTab={(currentTab) => {
          handleSetTab(currentTab);
        }}
      />
      {currentTab === "General" && <GeneralTab user={userInfo} />}
      {currentTab === "Profile" && <ProfileTab user={userInfo} />}
      {currentTab === "Bookshelf" && <BookshelfTab user={userInfo} />}
      {currentTab === "BoM" && <BomTab user={userInfo} />}
      {currentTab === "Clubs" && <ClubsTab user={userInfo} />}
      {currentTab === "Followers" && <FollowersTab user={userInfo} />}
    </div>
  );
};

export default OwnedProfile;
