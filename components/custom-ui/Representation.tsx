"use client";

import React, { useState } from "react";

import Image from "next/image";
interface Props {
  selectedOption: any;
  onChange: (value: any) => void;
  options: any[];
}

const Representation = ({ selectedOption, options, onChange }: Props) => {
  const [open, setOpen] = useState(false);

  const handleChange = (event: any, item: any) => {
    event.preventDefault();
    setOpen(false);
    onChange(item);
  };

  return (
    <div className="relative w-full">
      <article
        onClick={() => setOpen(!open)}
        className="h-10 px-4 flex flex-row items-center gap-2 rounded-lg bg-gray-100"
      >
        {selectedOption && (
          <>
            <div>
              <Image
                src={selectedOption?.image}
                alt="Profile picture"
                width={20}
                height={20}
                className="rounded-full object-cover"
              />
            </div>

            <div>
              <p className="!text-small-regular text-black">
                {selectedOption?.name}
              </p>
            </div>
          </>
        )}
        {!selectedOption && (
          <div>
            <p className="!text-small-regular text-black">
              Please select a community
            </p>
          </div>
        )}
      </article>
      {open && (
        <div className="absolute mt-0 w-full z-10">
          {options.map((item: any) => (
            <article
              key={item._id}
              onClick={(e: any) => {
                handleChange(e, item);
              }}
              className="h-10 px-4 cursor-pointer flex flex-row items-center 
              gap-2  bg-gray-100 hover:bg-red-800"
            >
              <div>
                <Image
                  src={item.image}
                  alt="Profile picture"
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
              </div>

              <div>
                <p className="!text-small-regular text-black hover:text-white">
                  {item.name}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Representation;
