"use client";

import React, { ChangeEvent, useState } from "react";

import { Switch } from "../ui/switch";
import { updateUserDetails } from "@/lib/actions/user.actions";

interface Props {
  user: {
    id: string;
    visibility: boolean;
  };
}

const ProfileVisisbility = ({ user }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(user.visibility);

  const toggleProfileVisibility = async (value: boolean) => {
    setIsLoading(true);
    setProfileVisibility(value);
    // Call API to update visibility

    await updateUserDetails({
      userId: user.id,
      visibility: value,
    });

    setIsLoading(false);
  };

  return (
    <section
      className="flex max-sm:flex-col gap-10 border border-solid
     border-gray-300-400 rounded-xl p-5 shadow-sm"
    >
      <h1 className="profile-heading">Profile visibility</h1>

      <div className="flex flex-1 gap-6 justify-between items-center">
        <div className="flex flex-col">
          <label className="text-body1-bold dark:text-white">
            Make profile private
          </label>
          <label className="text-small-regular dark:text-white">
            Only allow followers to access content you share. (This does not
            apply to content shared in public groups)
          </label>
        </div>
        <Switch
          disabled={isLoading}
          checked={profileVisibility}
          onCheckedChange={(e) => toggleProfileVisibility(e)}
        />
      </div>
    </section>
  );
};

export default ProfileVisisbility;
