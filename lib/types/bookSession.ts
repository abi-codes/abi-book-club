import { IBook } from "./book";
import { IUser } from "./user";

export interface IBookSession {
  _id: string;
  id: string;
  bookId: IBook;
  startData: Date;
  endDate: Date;
  votes: string[];
  status: string;
  createdDate: Date;
  updatedDate: Date;
}
