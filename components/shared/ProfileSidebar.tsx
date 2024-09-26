"use client"; // Denotes that this module is a client-side module

// Import necessary dependencies
import { profileSidebarLinks } from "@/constants";
import { useState } from "react";

interface Props {
  defaultValue: string;
  setCurrentTab: (value: string) => void;
}

function ProfileSidebar({ defaultValue, setCurrentTab }: Props) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  //Write a function to handle tab change
  const handleTabChange = (value: string) => {
    //Call the onChange function with the new value
    setActiveTab(value);
    setCurrentTab(value);
  };
  return (
    <section className="no-scrollbar">
      <div className="flex w-full flex-1  gap-6 px-6 py-2.5">
        {profileSidebarLinks.map((link) => {
          return (
            <div
              onClick={() => handleTabChange(link.label)}
              key={link.label}
              className={`flex items-center gap-4 cursor-pointer 
              hover:bg-light-3 p-3 rounded-md w-full 
              ${link.label === activeTab ? "bg-light-3" : ""}`}
            >
              <img src={link.imgURL} alt={link.label} />
              <span className="max-sm:hidden">{link.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProfileSidebar;
