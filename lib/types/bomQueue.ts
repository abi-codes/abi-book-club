import { IBookSession } from "./bookSession";
import { ICommunity } from "./community";

export interface IBomQueue {
  id: string;
  communityId: ICommunity;
  startDate: Date;
  endDate: Date;
  bookSessions: IBookSession[];
  status: string;
  createdDate: Date;
  updatedDate: Date;
}
