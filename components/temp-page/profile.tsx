"use client";

import ProfileHeader from "@/components/shared/ProfileHeader";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import EntriesTab from "@/components/shared/EntriesTab";
import Bookshelf from "@/components/shared/Bookshelf";
import UserCard from "@/components/cards/UserCard";
import { IUser } from "@/lib/types/user";

interface Props {
  currentUserId: string;
  id: string;
  userInfo: IUser;
  isOwner: boolean;
  isFollowing: boolean;
}
async function Profile({
  id,
  currentUserId,
  userInfo,
  isOwner,
  isFollowing,
}: Props) {
  return (
    <div className="flex-1">
      <ProfileHeader
        accountId={currentUserId}
        // authUserId={userInfo.id}
        //name={userInfo.name}
        //accountId={userInfo.id || ""}
        authUserId={id}
        name={userInfo.name || ""}
        surname={userInfo.surname}
        username={userInfo.username || ""}
        imgUrl={userInfo.image || ""}
        bio={userInfo.bio || ""}
        occupation={userInfo.occupation}
        isOwner={isOwner}
        isFollowing={isFollowing}
        address={JSON.parse(JSON.stringify(userInfo.address))}
      />

      <div className="mt-9">
        <Tabs defaultValue="bookshelf" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab: any) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />

                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Bookshelf" && (
                  <p className="ml-1 rounded-md bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.bookshelf?.length}
                  </p>
                )}

                {tab.label === "Entries" && (
                  <p className="ml-1 rounded-md bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}

                {tab.label === "Followers" && !isOwner && (
                  <p className="ml-1 rounded-md bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.followers?.length}
                  </p>
                )}

                {tab.label === "Following" && isOwner && (
                  <p className="ml-1 rounded-md bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.following?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
            {!isOwner && (
              <TabsTrigger
                key={"followers"}
                value={"followers"}
                className="tab"
              >
                <Image
                  src={"/assets/followers.svg"}
                  alt={"Followers"}
                  width={24}
                  height={24}
                  className="object-contain"
                />

                <p className="max-sm:hidden">{"Followers"}</p>
                <p className="ml-1 rounded-md bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                  {userInfo?.followers?.length}
                </p>
              </TabsTrigger>
            )}

            {isOwner && (
              <TabsTrigger
                key={"following"}
                value={"following"}
                className="tab"
              >
                <Image
                  src={"/assets/followers.svg"}
                  alt={"Following"}
                  width={24}
                  height={24}
                  className="object-contain"
                />

                <p className="max-sm:hidden">{"Following"}</p>
                <p className="ml-1 rounded-md bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                  {userInfo?.following?.length}
                </p>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent
            key={`content-bookshelf`}
            value="bookshelf"
            className="w-full text-light-1"
          >
            <Bookshelf
              shelf={JSON.parse(JSON.stringify(userInfo.bookshelf))}
              userId={userInfo.id || ""}
              isOwner={isOwner}
            />
          </TabsContent>

          <TabsContent
            key={`content-entries`}
            value="entries"
            className="w-full text-light-1"
          >
            {/* <EntriesTab
              currentUserId={userInfo._id}
              accountId={userInfo.id}
              accountType="User"
            /> */}
          </TabsContent>

          <TabsContent
            key={`content-followers`}
            value="followers"
            className="w-full text-light-1"
          >
            {userInfo?.followers?.map((follower: any) => (
              <UserCard
                key={follower.id}
                id={follower.id}
                name={follower.name}
                username={follower.username}
                imgUrl={follower.image}
                personType="User"
              />
            ))}
          </TabsContent>
          <TabsContent
            key={`content-following`}
            value="following"
            className="w-full text-light-1"
          >
            {userInfo?.following?.map((follower: any) => (
              <UserCard
                key={follower.id}
                id={follower.id}
                name={follower.name}
                username={follower.username}
                imgUrl={follower.image}
                personType="User"
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;
