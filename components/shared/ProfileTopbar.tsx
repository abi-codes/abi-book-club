"use client"; // Denotes that this module is a client-side module

// Import necessary dependencies
import { profileTopbarLinks } from "@/constants";
import { useState, useContext } from "react";
import MyThemeContext from "@/store/ThemeContext"; // Custom context for theme

interface Props {
  defaultValue: string;
  setCurrentTab: (value: string) => void;
}

function ProfileTopbar({ defaultValue, setCurrentTab }: Props) {
  //initialize neccesary hooks
  const { isDarkTheme } = useContext(MyThemeContext); // Get theme context

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
        {profileTopbarLinks.map((link) => {
          return (
            <div
              onClick={() => handleTabChange(link.label)}
              key={link.label}
              className={`flex items-center gap-4 cursor-pointer 
              hover:bg-gray-200 dark:hover:bg-dark-4 p-3 rounded-md w-full 
              ${link.label === activeTab ? "bg-gray-200 dark:bg-dark-4" : ""}`}
            >
              <img
                src={isDarkTheme ? link.dimgURL : link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <span className="max-sm:hidden dark:text-gray-100">
                {link.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProfileTopbar;
