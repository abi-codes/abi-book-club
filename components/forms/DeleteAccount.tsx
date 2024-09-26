"use client";

import React, { useState } from "react";

import { Button } from "../ui/button";
import ValidationModal from "../modals/validation-modal/validation-modal";
import { updateUserDetails } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

interface Props {
  user: {
    id: string;
  };
}

const DeleteAccount = ({ user }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const router = useRouter();

  const handleAccountDeletion = async () => {
    //Handle account deletion and log the user out
    setIsLoading(true);
    await updateUserDetails({
      userId: user.id,
      status: "archived",
      onboarded: false,
    });
    setIsLoading(false);

    setIsDeleted(false);

    router.push("/onboarding");
  };

  return (
    <section
      className="flex max-sm:flex-col gap-10 border border-solid
     border-gray-300-400 rounded-xl p-5 shadow-sm"
    >
      <h1 className="text-heading3-bold">Delete profile</h1>

      <div className="flex flex-col flex-1 gap-6">
        <div className="flex flex-col">
          <label className="text-small-semibold">
            Delete your account and all associated data. Be careful, this action
            is irreversible.
          </label>
        </div>

        <Button className="bg-red-800" onClick={() => setIsDeleted(true)}>
          Delete account
        </Button>
      </div>
      <ValidationModal
        open={isDeleted}
        validationTitle="Are you sure you want to delete your account?"
        validationDescription="You account will remain deactivated for 30 days before being permanently deleted. During this time, you can reactivate your account by logging in."
        close={() => setIsDeleted(false)}
        handleSubmit={() => handleAccountDeletion()}
        submitText="Delete account"
        cancellationText="Cancel"
      />
    </section>
  );
};

export default DeleteAccount;
