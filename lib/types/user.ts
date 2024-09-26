import { IAddress } from "./address";
import { IBookshelf } from "./bookshelf";
import { ICommunity } from "./community";
import { IEntry } from "./entry";

export type IUser = {
  _id: string;
  id?: string;
  name?: string;
  surname?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  occupation?: string;
  image?: string;
  backgroundImage?: string;
  bio?: string;
  address?: IAddress[];
  threads?: IEntry[];
  onboarded?: boolean;
  followers?: IUser[];
  following?: IUser[];
  communities?: ICommunity[];
  bookshelf?: IBookshelf[];
  createdDate?: Date;
  updatedDate?: Date;
  role?: string;
  createdAt?: Date;
  visibility?: boolean;
  status?: string;
};

export type IClubUser = {
  _id: string;
  id: string;
  _clubId: string;
  clubId: string;
  clubName: string;
  clubImage: string;
  bio: string;
  name: string;
  surname: string;
  username: string;
  image: string;
  type: string;
};
