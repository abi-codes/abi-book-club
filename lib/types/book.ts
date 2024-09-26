import { IBookReview } from "./bookReview";

export type IBook = {
  id: string;
  bookId: string;
  title: string;
  subtitle: string;
  description: string;
  categories: string[];
  authors: string[];
  cover: string;
  reviews: IBookReview[];
  createdDate: Date;
  updatedDate: Date;
};
