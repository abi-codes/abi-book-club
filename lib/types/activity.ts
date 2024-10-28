import { ICommunity } from "./community";
import { IUser } from "./user";

//create a typed interface for activity
export type IActivity = {
  id: string;
  creatorUser: IUser;
  recieverUser: IUser;
  creatorCommunity: ICommunity;
  objectId: string;
  createdDate: Date;
  notificationType: string;
  read: string;
};
