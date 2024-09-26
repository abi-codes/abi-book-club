"use client";

import React from "react";

import BasicDetails from "../forms/BasicDetails";
import ProfileVisisbility from "../forms/ProfileVisibility";
import DeleteAccount from "../forms/DeleteAccount";
import { IUser } from "@/lib/types/user";

interface Props {
  user: IUser;
}
const GeneralTab = ({ user }: Props) => {
  return (
    <section className="flex flex-col gap-8">
      <BasicDetails user={user} />
      <ProfileVisisbility user={user} />
      <DeleteAccount user={user} />
    </section>
  );
};

export default GeneralTab;
