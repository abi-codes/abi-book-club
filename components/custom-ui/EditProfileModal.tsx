"use client";

import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import AccountProfile from "../forms/AccountProfile";
import Community from "../forms/Community";
import MyThemeContext from "@/store/ThemeContext";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  surname?: string;
  username: string;
  imgUrl: string;
  bio: string;
  occupation?: string;
  type?: "User" | "Community";
}

const EditProfileModal = ({
  accountId,
  authUserId,
  name,
  surname,
  username,
  imgUrl,
  bio,
  occupation,
  type,
}: Props) => {
  const [open, setOpen] = useState(false);

  const { isDarkTheme } = useContext(MyThemeContext);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="Profile image"
              fill
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
      </DialogTrigger>

      <DialogContent className="content-center sm:max-w-md max-h-screen overflow-y-scroll scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-base-semibold  text-slate-700 dark:text-gray-300">
            Edit {type === "Community" ? "community" : "profile"}
          </DialogTitle>
          <DialogDescription className="text-base-semibold  text-slate-600 dark:text-gray-400">
            Edit your {type === "Community" ? "community" : "profile"}. Click
            save when you're done.
          </DialogDescription>
        </DialogHeader>
        {type !== "Community" ? (
          <AccountProfile
            user={{
              id: accountId,
              username,
              name,
              surname,
              bio,
              image: imgUrl,
              occupation,
            }}
            btnTitle="Save"
            handleClose={() => setOpen(false)}
            onboarderd={true}
          />
        ) : (
          <Community
            community={{
              id: accountId,
              username,
              name,
              bio,
              image: imgUrl,
              ownerUserId: authUserId,
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
