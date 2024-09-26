"use server";

import { connectToDB } from "../mongoose";
import { IUser } from "../types/user";

export async function fetchFeed(user: IUser) {
  try {
    connectToDB();
    //We need to return a minimum of 10 content types

    //Check if the user is a part of any communitities

    //Return all the user communities.

    // return {
    //   feed: JSON.parse(JSON.stringify(returnResponse)),

    // };
  } catch (error) {
    console.error("Error fetching user communities:", error);
    throw error;
  }
}

async function getFollowingEntries(following: string[]) {}
