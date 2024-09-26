import React from "react";
import BookshelfSetting from "../forms/BookshelfSetting";

import { IUser } from "@/lib/types/user";

interface Props {
  user: IUser;
}

const BookshelfTab = ({ user }: Props) => {
  return (
    <section className="flex flex-col gap-8">
      <BookshelfSetting _userId={user._id} userId={user.id} />
    </section>
  );
};

export default BookshelfTab;
