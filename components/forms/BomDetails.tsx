"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { IBom } from "@/lib/types/bom";
import { fetchBoMDetailsByUserId } from "@/lib/actions/community.actions";
import { getMonth } from "@/lib/utils";

interface Props {
  _userId: string;
  userId: string;
}

const BomDetails = ({ userId, _userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [bomList, setBomList] = useState<IBom[]>([]);
  const [bomFilters, setBomFilters] = useState<string[]>([]);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    fetchBomList();
  }, [currentPage, bomFilters]);

  const fetchBomList = async () => {
    setIsLoading(true);

    fetchBoMDetailsByUserId({
      userId: _userId,
      pageNumber: currentPage,
      filters: bomFilters,
    })
      .then((response) => {
        setTotalPages(response.bomsTotalPages);
        setBomList(response.boms);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user clublist", error);
      });
  };

  return (
    <section
      className="flex max-sm:flex-col gap-10 border border-solid
   border-gray-300-400 rounded-xl p-5 shadow-sm"
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-heading3-bold w-48">Book of the month</h1>
        <p className="text-small-medium w-48">
          Tell us more about your interest by curating and awesome bookshelf
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
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Latest
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
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Not in shelf
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-6">
        {/* <Button className="bg-red-800" onClick={toggleProfileVisibility}>
          Add book
        </Button> */}
        <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-12">
          {/* Loop through books here */}
          {bomList.map((bom) => (
            <div
              key={bom.id}
              className="flex flex-col items-center cursor-pointer relative"
            >
              <div
                className="absolute top-5 left-5 z-50 
        rounded-full h-14 w-14  bg-white"
              >
                <img
                  src={bom.community?.image}
                  alt={bom.community?.id}
                  className="object-cover rounded-full h-14 w-14"
                />
              </div>
              {getMonth(bom.startDate.toString()) ==
              getMonth(bom.endDate.toString()) ? (
                <div>{getMonth(bom.startDate.toString())} </div>
              ) : (
                <div>
                  {getMonth(bom.startDate.toString())} -{" "}
                  {getMonth(bom.endDate.toString())}
                </div>
              )}

              <div className="relative h-40 w-28">
                <img src={bom.bookSession.bookId.cover} alt="book cover" />
              </div>
              <div className="mt-2 w-40">
                <p
                  className="text-center text-small-semibold lg:text-base-semibold
               h-11 text-black dark:text-light-1 mt-2 
                overflow-hidden text-ellipsis"
                >
                  {" "}
                  {bom.bookSession.bookId.title}
                </p>
                <p
                  className="text-xs text-center 
    text-black dark:text-light-1"
                >
                  {bom.bookSession.bookId.authors[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
        {bomList.length !== 0 && (
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

export default BomDetails;
