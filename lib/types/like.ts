import { IUser } from "./user";

export interface Like {
  id: string;
  user: IUser;
  createdAt: Date;
}
