import { BookQueue } from "./bookQueue";
import { IEntry } from "./entry";
import { IUser } from "./user";

export type ICommunity = {
  _id?: string;
  id?: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  status: string;
  createdBy: IUser | string;
  threads: IEntry[];
  members: IUser[];
  requests: IUser[];
  queues: BookQueue[];
  createdDate: Date;
  updatedDate: Date;
};

export type ICommunityForm = {
  id?: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  ownerUserId: string;
};
