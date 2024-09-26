import { IBook } from "./book";
import { IBookReview } from "./bookReview";

export type IBookshelf = {
  id: string;

  bookId: IBook;
  category: string;
  bookReviewId: IBookReview;

  createdDate: Date;
  updatedDate: Date;
};
