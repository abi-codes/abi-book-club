"use client";

import React, { ChangeEvent, useState } from "react";

import { Switch } from "../ui/switch";
import { IAddress } from "@/lib/types/address";
import AddressListing from "../custom-ui/AddressListing";

interface Props {
  id: string;
  address: IAddress[];
}

const AddressDetails = ({ id, address }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section
      className="flex max-sm:flex-col gap-10 border border-solid
     border-gray-300-400 rounded-xl p-5 shadow-sm"
    >
      <h1 className="text-heading3-bold">Address details</h1>

      <div className="flex flex-1 gap-6 justify-between items-center">
        <div className="flex flex-col">
          {address.length > 0 ? (
            <AddressListing
              userId={id}
              editAddress={() => {}}
              addAddress={() => {}}
              address={address}
            />
          ) : (
            <p>No address found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AddressDetails;
