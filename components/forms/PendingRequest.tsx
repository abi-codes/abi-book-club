"use client";

import React, { use, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  approveMemberToCommunity,
  declineRequestCommunity,
  fetchMembersDetailsByUserId,
  removeUserFromCommunity,
} from "@/lib/actions/community.actions";
import { IClubUser } from "@/lib/types/user";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  _userId: string;
}

const PendingRequest = ({ _userId, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [memberList, setMemberList] = useState<IClubUser[]>([]);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    fetchMembersDetailsByUserId({
      userId: _userId,
      pageNumber: currentPage,
    })
      .then((response) => {
        setMemberList(response.users);
        setTotalPages(response.communitiesTotalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user clublist", error);
      });
  }, [currentPage]);

  const removeMember = async (user: IClubUser) => {
    setIsLoading(true);
    await removeUserFromCommunity(user.id, user.clubId, "/");
    setPage(1);
    setIsLoading(false);
  };

  const declineRequest = async (user: IClubUser) => {
    setIsLoading(true);
    await declineRequestCommunity(user.id, user.clubId, "/");
    setPage(1);
    setIsLoading(false);
  };

  const approveRequest = async (user: IClubUser) => {
    setIsLoading(true);
    await approveMemberToCommunity(user.clubId, user.id, "/");
    setPage(1);
    setIsLoading(false);
  };

  const onProfileClick = (user: IClubUser) => {
    router.push(`/profile/${user.id}`);
  };
  return (
    <section
      className="flex max-sm:flex-col gap-10 border border-solid
   border-gray-300-400 rounded-xl p-5 shadow-sm"
    >
      <div className="flex flex-col gap-5">
        <h1 className="profile-heading">Pending requests</h1>
        <p className="meta-info text-small-medium w-48">
          Your community is trying to reach out
        </p>
        <div className="flex flex-col gap-4">
          <p className="text-black dark:text-light-1 text-sm">Filters</p>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Search for books"
              onChange={(event) => console.log(event.target.value)}
              className="account-form_input"
            />
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm checkbox-label">
                Lastest
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm checkbox-label">
                Oldest
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-6">
        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-2 gap-12">
          {/* Loop through books here */}
          {!isLoading &&
            memberList &&
            memberList.length > 0 &&
            memberList.map((member) => (
              <div
                key={member.id}
                className="flex flex-col cursor-pointer relative"
              >
                <p className="text-small-medium bg-red-500 w-auto rounded-full p-2  text-center text-white">
                  {member.clubName}
                </p>
                <div className="relative h-40 w-40 sm:w-48 rounded-full">
                  <img
                    onClick={() => onProfileClick(member)}
                    src={member.image}
                    alt={member.username}
                    title={member.username}
                    className="object-cover rounded-full h-40 w-40"
                  />

                  <div className="absolute bottom-1 right-10 z-50">
                    <div className="flex items-center justify-center h-14 w-14 bg-white rounded-full">
                      <img
                        src={member.clubImage}
                        alt="book cover"
                        className="object-cover rounded-full h-14 w-14"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2 w-40">
                  <p className="text-base-semibold text-black dark:text-light-1 overflow-hidden text-ellipsis">
                    {" "}
                    {member.name} {member.surname}
                  </p>

                  <p className="text-small-medium text-gray-1 overflow-hidden  text-ellipsis">
                    @{member.username}
                  </p>
                  <p className="mt-2 text-subtle-medium text-gray-1 h-16 overflow-hidden text-ellipsis">
                    {member.bio}
                  </p>
                </div>
                {member.type === "member" && (
                  <div className=" grid grid-cols-1">
                    <Button
                      variant="ghost"
                      onClick={() => removeMember(member)}
                    >
                      <img
                        src="/assets/close.svg"
                        alt="ban"
                        className="w-4 h-4"
                      />
                    </Button>
                  </div>
                )}
                {member.type === "request" && (
                  <div className=" grid grid-cols-2">
                    <Button
                      variant="ghost"
                      onClick={() => declineRequest(member)}
                    >
                      <img
                        src="/assets/close.svg"
                        alt="ban"
                        className="w-4 h-4"
                      />
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => approveRequest(member)}
                    >
                      <img
                        src="/assets/check.svg"
                        alt="ban"
                        className="w-4 h-4"
                      />
                    </Button>
                  </div>
                )}
              </div>
            ))}
        </div>
        {isLoading && <p>Loading...</p>}
        {!isLoading && memberList.length === 0 && (
          <p className="meta-info">No pending requests or members </p>
        )}
        {memberList.length !== 0 && (
          <div className="flex items-center justify-between">
            <div className="max-sm:hidden"></div>
            <div className="flex items-center gap-7">
              <Button
                className="cursor-pointer"
                disabled={currentPage - 1 <= 0}
                onClick={() => setPage(currentPage - 1)}
              >
                {"<"}
              </Button>
              <p>
                {currentPage} of {totalPages} page(s)
              </p>
              <Button
                className="cursor-pointer"
                disabled={currentPage == totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                {">"}
              </Button>
            </div>
            <div className="flex gap-3">
              {/* //Create a loop to loop over the number of pages */}
              {pages.map(
                (page, i) =>
                  i < 3 && (
                    <Button
                      key={page}
                      className={`${
                        currentPage === page
                          ? "bg-red-800 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                      onClick={() => setPage(page)}
                    >
                      {page}
                    </Button>
                  )
              )}

              {totalPages > 3 && (
                <div className="flex gap-2">
                  <span>...</span>
                  <Button className="bg-gray-200 text-black">
                    {totalPages}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PendingRequest;
