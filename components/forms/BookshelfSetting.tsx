"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { IBookshelf } from "@/lib/types/bookshelf";
import BookCard from "../cards/BookCard";
import { usePathname } from "next/navigation";
import {
  fetchUserBookshelf,
  removeUserBookshelf,
} from "@/lib/actions/user.actions";
import BookshelfItem from "./BookshelfItem";
import BookshelfItemView from "../cards/BookshelfItemView";

interface Props {
  _userId: string;
  userId: string;
}

const BookshelfSetting = ({ _userId, userId }: Props) => {
  //Loading state
  const [isLoading, setIsLoading] = useState(false);

  //List state
  const [userBookshelf, setUserBookshelf] = useState<IBookshelf[]>([]);

  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);

  //Shelf state
  const [currentShelfItem, setShelfItem] = useState<IBookshelf | null>();
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  //Filtering state
  const [currentPage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    fetchUserBookshelf({
      userId: _userId,
      pageNumber: currentPage,
      categories: categoryFilters,
    })
      .then((pageResponse) => {
        setUserBookshelf(pageResponse.bookshelf);
        setTotalPages(pageResponse.bookShelfTotalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error paging up", error);
      });
  }, [currentPage, categoryFilters]);

  const handleEditItem = (shelfItem: IBookshelf | null) => {
    setShelfItem(shelfItem);
    setEditOpen(true);
  };

  const handleViewItem = (shelfItem: any) => {
    setShelfItem(shelfItem);
    setViewOpen(true);
  };

  const handleDeleteItem = async (shelfItem: IBookshelf) => {
    // Before deleting, we need to check if the book is in the user's shelf
    await removeUserBookshelf(pathname, shelfItem.id, userId);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setShelfItem(null);
  };

  const selectCategory = (category: string) => {
    console.log("category", category);
    if (categoryFilters.includes(category)) {
      setCategoryFilters(categoryFilters.filter((cat) => cat !== category));
    } else {
      setCategoryFilters([...categoryFilters, category]);
    }
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section
      className="flex max-sm:flex-col gap-10 border border-solid
                 border-gray-300-400 rounded-xl p-5 shadow-sm"
    >
      <div className="flex flex-col gap-5">
        <h1 className="profile-heading">Bookshelf</h1>
        <p className="text-small-medium w-48 meta-info">
          Tell us more about your interest by curating and awesome bookshelf
        </p>
        <div className="flex flex-col gap-4">
          <p className="text-black text-body-bold dark:text-light-1 text-sm">
            Filters
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="haveRead"
                checked={categoryFilters.includes("haveRead")}
                onCheckedChange={() => selectCategory("haveRead")}
              />
              <label htmlFor="haveRead" className="text-sm checkbox-label">
                Have reads
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reading"
                checked={categoryFilters.includes("reading")}
                onCheckedChange={() => selectCategory("reading")}
              />
              <label htmlFor="reading" className="text-sm checkbox-label">
                Currently reading
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="toRead"
                checked={categoryFilters.includes("toRead")}
                onCheckedChange={() => selectCategory("toRead")}
              />
              <label htmlFor="toRead" className="text-sm checkbox-label">
                Want to read
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-6">
        <Button
          className="bg-red-800 dark:bg-red-800 dark:text-white"
          onClick={() => handleEditItem(null)}
        >
          Add book
        </Button>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-2 gap-12">
            {/* Loop through books here */}
            {userBookshelf && userBookshelf.length > 0 ? (
              userBookshelf.map((bookshelfItem) => (
                <BookCard
                  key={bookshelfItem.id}
                  book={bookshelfItem.bookId}
                  review={bookshelfItem.bookReviewId}
                  handleDeleteItem={() => handleDeleteItem(bookshelfItem)}
                  handleSelectItem={() => handleEditItem(bookshelfItem)}
                  handleViewItem={() => handleViewItem(bookshelfItem)}
                  isOwner={true}
                />
              ))
            ) : (
              <p className="meta-info">No books found</p>
            )}
          </div>
        )}
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
            <p className="dark:text-white">
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
                        ? "bg-red-800 text-white dark:bg-red-800 dark:text-white"
                        : "bg-gray-200 text-black dark:bg-gray-200 dark:text-black"
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
      {editOpen && (
        <BookshelfItem
          open={editOpen}
          handleClose={() => handleEditClose()}
          shelfItem={{
            ...currentShelfItem,
            book: currentShelfItem?.bookId,
            review: currentShelfItem?.bookReviewId,
          }}
          userId={userId}
        />
      )}

      {viewOpen && (
        <BookshelfItemView
          open={viewOpen}
          handleClose={() => setViewOpen(false)}
          shelfItem={{
            ...currentShelfItem,
            book: currentShelfItem?.bookId,
            review: currentShelfItem?.bookReviewId,
          }}
        />
      )}
    </section>
  );
};

export default BookshelfSetting;
