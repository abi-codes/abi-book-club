import { IBookSession } from "./bookSession";
import { ICommunity } from "./community";

export interface IBom {
  id: string;
  bookSession: IBookSession;
  community: ICommunity;
  startDate: Date;
  endDate: Date;
  createdDate: Date;
  updatedDate: Date;
}
