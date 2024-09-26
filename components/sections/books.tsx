"use client";

import { fetchBooks } from "@/lib/actions/book.actions";
import { IBook } from "@/lib/types/book";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Rating from "../custom-ui/RatingInput";

interface Props {
  initialBooks: IBook[];
}
const Books = ({ initialBooks }: Props) => {
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [books, setBooks] = useState<IBook[]>(initialBooks);
  const [scrollTrigger, isInView] = useInView();

  console.log("Zee books", books);

  useEffect(() => {
    if (isInView) {
      handleFetchBooks();
    }
  }, [isInView]);

  const handleFetchBooks = async () => {
    setLoading(true);
    const result = await fetchBooks(page, 15);
    const newBooks = [...books, ...result.books];
    setBooks(newBooks);

    setPage(page + 1);
    setHasMore(result.isNext);
    setLoading(false);
  };

  return (
    <section className="mt-9 flex flex-wrap gap-7">
      {books.length === 0 ? (
        <p className="no-result">No Books</p>
      ) : (
        books.map((book: any) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            className="w-32 sm:w-36 cursor-pointer"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full h-52 lg:h-52">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="mt-2 h-11 overflow-hidden text-ellipsis">
                <h2 className="text-base-semibold text-black dark:text-light-1">
                  {book.title}
                </h2>
              </div>
              <div className="flex gap-1">
                <Rating
                  defaultRating={
                    book?.reviews?.reduce(
                      (totalRating: number, review: any) => {
                        return (
                          totalRating + (review.rating ? review.rating : 0)
                        );
                      },
                      0
                    ) / book?.reviews?.length
                  }
                />
                <p className="text-black dark:text-light-1">
                  {book.reviews && book.reviews.length > 0
                    ? book?.reviews?.reduce(
                        (totalRating: number, review: any) => {
                          return (
                            totalRating +
                            (review.rating > 0 ? review.rating : 1)
                          );
                        },
                        0
                      ) / book?.reviews?.length
                    : 0}
                </p>
              </div>
            </div>
          </Link>
        ))
      )}
      {!hasMore && <div className="mt-10">You're up to date</div>}
      {loading && <div className="mt-10">Loading more books...</div>}
      {hasMore && !loading && (
        <div className="mt-10" ref={scrollTrigger}>
          Load more books...
        </div>
      )}
    </section>
  );
};

export default Books;
