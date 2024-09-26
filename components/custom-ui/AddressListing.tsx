import React, { useContext } from "react";
import Image from "next/image";
import MyThemeContext from "@/store/ThemeContext";
import { usePathname } from "next/navigation";
import { removeUserAddress } from "@/lib/actions/user.actions";
import { IAddress } from "@/lib/types/address";

interface Props {
  address: IAddress[];
  userId: string;
  editAddress: (address: any) => void;
  addAddress: () => void;
}

const AddressListing = ({
  address,
  userId,
  editAddress,
  addAddress,
}: Props) => {
  const { isDarkTheme } = useContext(MyThemeContext);
  const path = usePathname();

  const deleteAddress = async (address: any) => {
    await removeUserAddress(address._id, userId, path);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {address.map((address, index) => (
        <div
          key={index}
          className="flex
          relative
          shadow-sm
          overflow-hidden
          cursor-pointer  
          justify-between 
          items-center 
          border
          border-purple-300
          rounded-lg  dark:text-white
          p-2
          group"
        >
          <div className="absolute flex shadow-md items-center top-4 -right-4 bg-purple-300 h-4 w-20 z-50 m-auto rotate-45">
            <p className="text-white text-subtle-medium  text-center w-full">
              Default
            </p>
          </div>
          <div className="p-2" onClick={() => editAddress(address)}>
            <div className="flex items-center gap-2">
              <img src="/assets/home.svg" alt="home" />
              <h3 className="text-heading4-medium ">Home</h3>
            </div>
            <p className="w-60">
              {address.streetLine1} {address.streetLine2}, {address.city},{" "}
              {address.province}, {address.postalCode}, {address.country}
            </p>
          </div>
          <div
            className="opacity-0 group-hover:opacity-100 group-hover: bg-red-500 h-full border-gray-500 px-2 relative 
            flex flex-col justify-center items-center"
            onClick={() => deleteAddress(address)}
          >
            <Image
              src={`${
                isDarkTheme ? "/assets/trash-w.svg" : "/assets/trash.svg"
              }`}
              alt={"delete"}
              width={24}
              height={24}
            />
          </div>
        </div>
      ))}

      {/* <p
        onClick={() => addAddress()}
        className="text-center text-small-regular text-blue cursor-pointer  hover:underline"
      >
        Add address
      </p> */}
    </div>
  );
};

export default AddressListing;
