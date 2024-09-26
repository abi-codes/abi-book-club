"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import {
  memberRequestToCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} from "@/lib/actions/community.actions";
import { usePathname } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

import EditProfileModal from "../custom-ui/EditProfileModal";
import AddressModal from "../custom-ui/AddressModal";
import { useContext, useState } from "react";
import MyThemeContext from "@/store/ThemeContext";
import { followUser, unfollowUser } from "@/lib/actions/user.actions";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  surname?: string;
  username: string;
  imgUrl: string;
  bio: string;
  address?: [
    {
      _id?: string;
      id?: string;
      streetLine1: string;
      streetLine2: string;
      city: string;
      province: string;
      postalCode: string;
      country: string;
      countryCode: string;
      isPrimary: boolean;
      __v: number;
    },
  ];
  occupation?: string;
  isMember?: boolean;
  isFollowing?: boolean;
  isRequester?: boolean;
  isOwner?: boolean;
  type?: "User" | "Community";
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  surname,
  username,
  address,
  imgUrl,
  bio,
  occupation,
  isMember,
  isFollowing,
  isRequester,
  isOwner,
  type,
}: Props) => {
  const pathName = usePathname();

  const joinCommunity = async () => {
    await memberRequestToCommunity(accountId, authUserId, pathName);
  };

  const follow = async () => {
    await followUser(authUserId, accountId, pathName);
  };

  const unfollow = async () => {
    await unfollowUser(authUserId, accountId, pathName);
  };

  const leaveCommunity = async () => {
    await removeUserFromCommunity(authUserId, accountId, pathName);
  };

  const confirmDeleteCommunity = async () => {
    await updateCommunityInfo(accountId, name, username, imgUrl, "delete", bio);
  };

  const { isDarkTheme } = useContext(MyThemeContext);

  const primaryAddress =
    address && address.length > 0
      ? address.find((address) => address.isPrimary)
        ? address.find((address) => address.isPrimary)
        : address[0]
      : null;

  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        {isOwner ? (
          <div className="flex flex-col gap-4">
            <EditProfileModal
              accountId={accountId}
              authUserId={authUserId}
              name={name}
              surname={surname}
              occupation={occupation}
              username={username}
              imgUrl={imgUrl}
              bio={bio}
              type={type}
            />
            <AddressModal address={address} userId={accountId} />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="flex h-14 w-14 rounded-full justify-center relative overflow-hidden">
                <Image
                  src={imgUrl}
                  alt="Profile image"
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-left text-heading3-bold text-black dark:text-light-1">
                  {name} {surname && surname}
                </h2>
                <p className="text-base-medium text-gray-1">@{username}</p>
                {occupation && (
                  <div className="flex relative gap-1">
                    <Image
                      width={16}
                      height={16}
                      alt="job"
                      src={`${
                        isDarkTheme ? "/assets/job-w.svg" : "/assets/job.svg"
                      }`}
                    />
                    <p className="text-base-medium text-gray-1">{occupation}</p>
                  </div>
                )}
              </div>
            </div>
            {primaryAddress && (
              <div className="flex relative gap-1">
                <Image
                  width={16}
                  height={16}
                  alt="location"
                  src={`${
                    isDarkTheme
                      ? "/assets/location-w.svg"
                      : "/assets/location.svg"
                  }`}
                />
                <p className="dark:text-light-1">
                  {primaryAddress?.city} {primaryAddress?.country}
                </p>
              </div>
            )}
          </div>
        )}

        {!isOwner && !isFollowing && (
          <div>
            <Button
              onClick={() => follow()}
              size="sm"
              className="community-card_btn"
            >
              Follow
            </Button>
          </div>
        )}

        {!isOwner && isFollowing && (
          <div>
            <Button
              onClick={() => unfollow()}
              size="sm"
              className="community-card_btn"
            >
              Unfollow
            </Button>
          </div>
        )}

        {!isOwner && !isMember && type === "Community" && (
          <Button
            onClick={() => joinCommunity()}
            size="sm"
            className="community-card_btn"
            disabled={isRequester}
          >
            {isRequester ? "Pending" : "Join"}
          </Button>
        )}
        {isOwner && isMember && type === "Community" && (
          <div>
            <img
              src="/assets/settings.svg"
              alt="settings"
              className="w-8 h-8 cursor-pointer"
            />

            {/* <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  className="community-card_btn bg-red-800 dark:bg-red-800"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your club, remove all your club's entries and members.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => confirmDeleteCommunity()}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog> */}
          </div>
        )}
        {!isOwner && isMember && type === "Community" && (
          <div>
            <Button
              onClick={() => leaveCommunity()}
              size="sm"
              className="community-card_btn bg-slate-800"
            >
              Leave
            </Button>
          </div>
        )}
      </div>

      {/* TODO: Community */}

      <p className="mt-6 text-base-regular text-black dark:text-light-2">
        {bio}
      </p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
