"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { ICommunity } from "@/lib/types/community";
import { fetchCommunitiesByUserId } from "@/lib/actions/community.actions";
import CommunityCard from "../cards/CommunityCard";
import CommunityDialog from "./CommunityDialog";

interface Props {
  _userId: string;
  userId: string;
}

const ClubDetails = ({ _userId, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [userClublist, setUserClublist] = useState<any[]>([]);

  const [currentClubItem, setClubItem] = useState<ICommunity | null>();
  const [editOpen, setEditOpen] = useState(false);

  const [currentPage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    setIsLoading(true);
    fetchCommunitiesByUserId({
      userId: _userId,
      pageNumber: currentPage,
    })
      .then((response) => {
        setUserClublist(response.communities);
        setTotalPages(response.communitiesTotalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user clublist", error);
      });
  }, [currentPage]);

  const handleEdit = (club: ICommunity) => {
    setClubItem(club);
    setEditOpen(true);
  };

  const toggleNewClub = () => {
    setClubItem(null);
    setEditOpen(true);
  };

  return (
    <section
      className="flex max-sm:flex-col gap-10 border border-solid
   border-gray-300-400 rounded-xl p-5 shadow-sm"
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-heading3-bold">Club list</h1>
        <p className="text-small-medium w-48">
          Your community of book lovers all in one area
        </p>
        <div className="flex flex-col gap-4">
          <p className="text-black dark:text-light-1 text-sm">Filters</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Has notifications
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Lastest
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Oldest
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-6">
        <Button className="bg-red-800" onClick={() => toggleNewClub()}>
          Add club
        </Button>
        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-2 gap-12">
          {/* Loop through books here */}
          {!isLoading &&
            userClublist &&
            userClublist.length > 0 &&
            userClublist.map((club) => (
              <CommunityCard
                onClick={() => handleEdit(club)}
                community={JSON.parse(JSON.stringify(club))}
                key={club?.id}
              />
            ))}
        </div>
        {isLoading && <p>Loading...</p>}
        {!isLoading && userClublist.length === 0 && <p>No Clubs</p>}
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
                <Button className="bg-gray-200 text-black">{totalPages}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <CommunityDialog
        open={editOpen}
        community={currentClubItem ? currentClubItem : null}
        handleClose={() => setEditOpen(false)}
        userId={userId}
      />
    </section>
  );
};

export default ClubDetails;
