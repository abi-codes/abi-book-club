import { IBom } from "./bom";
import { IBomQueue } from "./bomQueue";
import { ICommunity } from "./community";
import { Like } from "./like";
import { IUser } from "./user";

export interface IEntry {
  _id: string;
  text: string;
  author: IUser;
  queueId?: IBomQueue;
  bomId?: IBom;
  community: ICommunity;
  createdAt: Date;
  parentId: string;
  likes: Like[];
  children: IEntry[];
}
