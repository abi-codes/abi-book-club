import React from "react";
import ProfileDetails from "../forms/ProfileDetails";
import AddressDetails from "../forms/AddressDetails";
import { IUser } from "@/lib/types/user";

interface Props {
  user: IUser;
}
const ProfileTab = ({ user }: Props) => {
  return (
    <section className="flex flex-col gap-8">
      <ProfileDetails user={user} />
      <AddressDetails address={user.address} id={user.id} />
    </section>
  );
};

export default ProfileTab;
