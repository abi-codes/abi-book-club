"use client";

import { SignOutButton, useAuth } from "@clerk/nextjs";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MyThemeContext from "@/store/ThemeContext";
import { topbarLinks } from "@/constants";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  userId: string | null | undefined;
}

const UserButton = ({ userId }: Props) => {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const { isDarkTheme } = useContext(MyThemeContext);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentCommunities, setCurrentCommunities] = useState<any>([]);
  const [loadingUser, setLoadingUser] = useState(true);

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const wrapperRef = useRef(null);
  const upperRef = useRef(null);

  const handleClickOutside = (
    ref: React.RefObject<HTMLElement>,
    parentRef: React.RefObject<HTMLElement>,
    callback: () => void
  ) => {
    const handleClick = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        parentRef.current &&
        !parentRef.current.contains(event.target as Node)
      ) {
        callback();
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClick);
      return () => {
        document.removeEventListener("mousedown", handleClick);
      };
    }, []);
  };

  useEffect(() => {
    async function loadUser() {
      setLoadingUser(true);
      try {
        const userFetchResponse = userId
          ? await fetch(`/api/user/${userId}`).then((res) => res.json())
          : null;

        const user = userFetchResponse?.user;

        setCurrentCommunities(
          user.communities
            ? user.communities.filter((x: any) => x.createdBy == user._id)
            : []
        );

        setCurrentUser(user);
        setLoadingUser(false);
      } catch (error) {
        console.log("Error fetching user", error);
        setLoadingUser(false);
      }
    }

    isSignedIn && !currentUser && loadUser();
  }, []);

  handleClickOutside(wrapperRef, upperRef, () => {
    setOpen(false);
  });

  const handleRoute = (route: string) => {
    router.push(route);
    setOpen(false);
  };

  return (
    <div className="flex">
      {!loadingUser && !currentUser ? (
        <p>Sign in</p>
      ) : loadingUser ? (
        <div className="h-10 w-10 animate-spin">
          <svg
            className="text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="flex flex-col relative">
          <div
            ref={upperRef}
            className="flex h-10 w-10 rounded-full justify-center relative cursor-pointer"
            onClick={() => setOpen(open ? false : true)}
          >
            <Image
              src={currentUser ? currentUser.image : ""}
              alt="community_logo"
              width={96}
              height={96}
              className="object-cover rounded-full"
            />
          </div>
          <div
            ref={wrapperRef}
            className={`${
              open
                ? `opacity-100 -translate-x-[12.5rem] translate-y-[20px]`
                : `opacity-0 translate-x-10 translate-y-[0px]`
            } user-btn text-small-medium`}
          >
            {topbarLinks.map((link) => {
              const isActive =
                (pathname.includes(link.route) && link.route.length > 1) ||
                pathname === link.route;

              if (link.route === "/profile")
                link.route = `${link.route}/${userId}`;

              return (
                <div
                  onClick={() => handleRoute(link.route)}
                  key={link.label}
                  className="user-btn-links"
                >
                  <Image
                    src={isDarkTheme ? link.dimgURL : link.imgURL}
                    alt={link.label}
                    width={20}
                    height={20}
                  />

                  <p>{link.label}</p>
                </div>
              );
            })}

            {currentCommunities.map((community: any) => {
              return (
                <div
                  onClick={() => handleRoute(`/clubs/${community.id}`)}
                  key={community.name}
                  className="user-btn-links"
                >
                  <Image
                    src={community.image}
                    alt={community.name}
                    width={20}
                    height={20}
                  />

                  <p>{community.name}</p>
                </div>
              );
            })}

            <SignOutButton>
              <div className="user-btn-links">
                <Image
                  src={
                    isDarkTheme ? "/assets/logout-w.svg" : "/assets/logout.svg"
                  }
                  alt="logout"
                  width={20}
                  height={20}
                />
                Logout
              </div>
            </SignOutButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserButton;
