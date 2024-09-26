import { IBook } from "./book";
import { IUser } from "./user";

export type IBookReview = {
  id: string;
  createdBy: IUser;
  book: IBook;
  rating: number;
  review: string;
  createdDate: Date;
  updatedDate: Date;
};
