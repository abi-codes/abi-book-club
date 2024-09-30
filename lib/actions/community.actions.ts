"use server";

import { FilterQuery, SortOrder } from "mongoose";

import Community from "../models/community.model";
import Entry from "../models/entry.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import Like from "../models/like.model";
import BomQueue from "../models/bomQueue.model";
import BookSession from "../models/bookSession.model";
import { updateOrCreateBook } from "./book.actions";
import Book from "../models/book.model";
import BookReview from "../models/bookReview.model";
import { ICommunity } from "../types/community";
import { IClubUser } from "../types/user";
import { IBomQueue } from "../types/bomQueue";
import Bom from "../models/bom.model";
import { IBom } from "../types/bom";

export async function createCommunity(
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string // Change the parameter name to reflect it's an id
) {
  try {
    connectToDB();

    // Find the user with the provided unique id
    const user = await User.findOne({ id: createdById });

    if (!user) {
      throw new Error("User not found"); // Handle the case if the user with the id is not found
    }

    const newCommunity = new Community({
      name,
      username,
      image,
      bio,
      status: "active",
      createdBy: user._id, // Use the mongoose ID of the user
    });

    const createdCommunity = await newCommunity.save();

    await memberRequestToCommunity(
      createdCommunity.id,
      user.id,
      `/clubs/${createdCommunity.id}`
    );

    // Add admin memeber to community
    await approveMemberToCommunity(
      createdCommunity.id,
      user.id,
      `/clubs/${createdCommunity.id}`
    );

    return createdCommunity.id;
  } catch (error) {
    // Handle any errors
    console.error("Error creating community:", error);
    throw error;
  }
}

export async function fetchCommunitiesByUserId({
  userId,
  pageNumber = 1,
  pageSize = 3,
  sortBy = "desc",
}: {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const sortOptions = { createdDate: sortBy };

    const query: FilterQuery<typeof Community> = {
      createdBy: { $eq: userId }, // Exclude the current user from the results.
      memebers: { $neq: userId },
    };

    const communityQueryResponse = await Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "members",
        model: User,
        select: "name image _id id",
      });
    // .populate("requests");

    const totalCommunityItemsCount = await Community.countDocuments(query);

    const totalPages = Math.ceil(totalCommunityItemsCount / pageSize);
    const isNext = pageNumber < totalPages;

    const returnResponse = <ICommunity[]>communityQueryResponse;

    return {
      communities: JSON.parse(JSON.stringify(returnResponse)),
      communitiesPageSize: pageSize,
      communitiesHasNext: isNext,
      communitiesTotalPages: totalPages,
      communitiesCurrentPage: pageNumber,
    };
  } catch (error) {
    console.error("Error fetching user communities:", error);
    throw error;
  }
}

export async function fetchMembersDetailsByUserId({
  userId,
  pageNumber = 1,
  pageSize = 3,
  sortBy = "desc",
}: {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const sortOptions = { createdDate: sortBy };

    const query: FilterQuery<typeof Community> = {
      createdBy: { $eq: userId }, // Exclude the current user from the results.
    };

    const communityQueryResponse = await Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "requests",
        model: User,
        select: "name surname username bio image _id id",
      })
      .populate({
        path: "members",
        model: User,
        select: "name surname username bio image _id id",
      });
    // .populate("requests");
    const communities = <ICommunity[]>communityQueryResponse;

    const returnResponse = <IClubUser[]>communities
      .map((c) => {
        const requests = c?.requests.map((user: any) => ({
          ...user._doc,
          _clubId: c._id,
          clubId: c.id,
          clubName: c.name,
          clubImage: c.image,
          type: "request",
        }));
        const members = c?.members
          .filter((user: any) => user._id != userId)
          .map((user: any) => ({
            ...user._doc,
            _clubId: c._id,
            clubId: c.id,
            clubName: c.name,
            clubImage: c.image,
            type: "member",
          }));
        return requests?.concat(members);
      })
      .flat();

    const totalCommunityItemsCount = await Community.countDocuments(query);

    const totalPages = Math.ceil(returnResponse.length / pageSize);
    const isNext = pageNumber < totalPages;

    return {
      users: JSON.parse(JSON.stringify(returnResponse)),
      communitiesPageSize: pageSize,
      communitiesHasNext: isNext,
      communitiesTotalPages: totalPages,
      communitiesCurrentPage: pageNumber,
    };
  } catch (error) {
    console.error("Error fetching user communities:", error);
    throw error;
  }
}

export async function fetchQueueDetailsByUserId({
  userId,
  filters = [],
  pageNumber = 1,
  pageSize = 1,
  sortBy = "desc",
}: {
  userId: string;
  filters?: string[];
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const sortOptions = { createdDate: sortBy };

    const communityQuery: FilterQuery<typeof Community> = {
      createdBy: { $eq: userId }, // Exclude the current user from the results.
    };

    const communityQueryResponse = await Community.find(communityQuery);

    const query: FilterQuery<typeof BomQueue> = {
      communityId: {
        $in: communityQueryResponse.map((c) => {
          return c._id;
        }),
      }, // Exclude the current user from the results.
    };

    //seperate the club filter from the status filter
    if (filters && filters.length > 0) {
      const clubFilter = filters.filter((f) => f.includes("club"));
      const statusFilter = filters.filter((f) => f.includes("status"));

      if (clubFilter.length > 0) {
        query.communityId = { $in: clubFilter.map((c) => c.split("|")[1]) };
      }

      if (statusFilter.length > 0) {
        query.status = {
          $in: statusFilter.map((c) => c.split("|")[1]),
        };
      }
    }

    const queueQueryResponse = await BomQueue.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate([
        {
          path: "bookSessions",
          model: BookSession,
          populate: [
            {
              path: "bookId",
              model: Book,
            },
            // {
            //   path: "votes",
            //   model: User,
            // },
          ],
        },
        {
          path: "communityId",
          model: Community,
        },
      ]);

    const communitiesResponse = <ICommunity[]>communityQueryResponse;
    const returnResponse = <IBomQueue[]>queueQueryResponse
      .map((q) => {
        return {
          ...q._doc,
        };
      })
      .flat();

    const totalQueryItemsCount = await BomQueue.countDocuments(query);

    const totalPages = Math.ceil(totalQueryItemsCount / pageSize);
    const isNext = pageNumber < totalPages;

    return {
      communities: JSON.parse(JSON.stringify(communitiesResponse)),
      queues: JSON.parse(JSON.stringify(returnResponse)),
      queuesPageSize: pageSize,
      queuesHasNext: isNext,
      queuesTotalPages: totalPages,
      queuesCurrentPage: pageNumber,
    };
  } catch (error) {
    console.error("Error fetching user community queues:", error);
    throw error;
  }
}

export async function fetchBoMDetailsByUserId({
  userId,
  filters = [],
  pageNumber = 1,
  pageSize = 1,
  sortBy = "desc",
}: {
  userId: string;
  filters?: string[];
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const sortOptions = { createdDate: sortBy };

    const communityQuery: FilterQuery<typeof Community> = {
      createdBy: { $eq: userId }, // Exclude the current user from the results.
    };

    const communityQueryResponse = await Community.find(communityQuery);

    const query: FilterQuery<typeof Bom> = {
      community: {
        $in: communityQueryResponse.map((c) => {
          return c._id;
        }),
      }, // Exclude the current user from the results.
    };

    //seperate the club filter from the status filter
    if (filters && filters.length > 0) {
      const clubFilter = filters.filter((f) => f.includes("club"));
      const statusFilter = filters.filter((f) => f.includes("status"));

      if (clubFilter.length > 0) {
        query.community = { $in: clubFilter.map((c) => c.split("|")[1]) };
      }

      if (statusFilter.length > 0) {
        query.status = {
          $in: statusFilter.map((c) => c.split("|")[1]),
        };
      }
    }

    const queueQueryResponse = await Bom.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate([
        {
          path: "bookSession",
          model: BookSession,
          populate: [
            {
              path: "bookId",
              model: Book,
            },
            {
              path: "votes",
              model: User,
            },
          ],
        },
        {
          path: "community",
          model: Community,
        },
      ]);

    const communitiesResponse = <ICommunity[]>communityQueryResponse;
    const returnResponse = <IBom[]>queueQueryResponse
      .map((q) => {
        return {
          ...q._doc,
        };
      })
      .flat();

    const totalQueryItemsCount = await Bom.countDocuments(query);

    const totalPages = Math.ceil(totalQueryItemsCount / pageSize);
    const isNext = pageNumber < totalPages;

    return {
      communities: JSON.parse(JSON.stringify(communitiesResponse)),
      boms: JSON.parse(JSON.stringify(returnResponse)),
      bomsPageSize: pageSize,
      bomsHasNext: isNext,
      bomsTotalPages: totalPages,
      bomsCurrentPage: pageNumber,
    };
  } catch (error) {
    console.error("Error fetching user community queues:", error);
    throw error;
  }
}

export async function fetchCommunityDetails(id: string) {
  try {
    connectToDB();

    const communityDetails = await Community.findOne({ id }).populate([
      "createdBy",
      {
        path: "members",
        model: User,
        select: "name username image _id id",
      },
      {
        path: "requests",
        model: User,
        select: "name username image _id id",
      },
      {
        path: "queues",
        model: BomQueue,
        populate: [
          {
            path: "bookSessions",
            model: BookSession,
            populate: [
              {
                path: "bookId",
                model: Book,
              },
              {
                path: "votes",
                model: User,
              },
            ],
          },
        ],
      },
    ]);

    if (communityDetails && communityDetails.queues) {
      for (const book of communityDetails.queues) {
        for (const session of book.bookSessions) {
          const reviews: any[] = await BookReview.find({
            bookId: session.bookId._id,
          });
          session.bookId.reviews = reviews;
        }
      }
    }

    return communityDetails;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community details:", error);
    throw error;
  }
}

export async function fetchCommunityPosts(id: string) {
  try {
    connectToDB();

    const communityPosts = await Community.findById({ _id: id }).populate({
      path: "threads",
      options: { sort: { createdAt: "desc" } },
      model: Entry,
      populate: [
        {
          path: "likes", // Populate the likes field
          model: Like,
        },
        {
          path: "author",
          model: User,
          select: "name image id", // Select the "name" and "_id" fields from the "User" model
        },
        {
          path: "children",
          model: Entry,
          populate: {
            path: "author",
            model: User,
            select: "image _id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });

    return communityPosts;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community posts:", error);
    throw error;
  }
}

export async function fetchCommunities({
  userId = "",
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId?: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of communities to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof Community> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
        { status: "active" },
      ];
    }

    if (userId && userId !== "") {
      query.$and = [{ createdby: { $ne: userId } }]; // Exclude the current user from the results.
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members")
      .populate("requests");

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await Community.countDocuments(query);

    const response = await communitiesQuery.exec();

    const communities: ICommunity[] = <ICommunity[]>response;
    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

export async function memberRequestToCommunity(
  communityId: string,
  memberId: string,
  path: string
) {
  try {
    connectToDB();

    // Find the community by its unique id
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    // Find the user by their unique id
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user has already made a request
    if (community.requests.includes(user._id)) {
      throw new Error("User has already made a request to join the community");
    }

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    // Add the user's _id to the requests array in the community
    community.requests.push(user._id);
    await community.save();

    revalidatePath(path);
    // return community;
  } catch (error) {
    // Handle any errors
    console.error("Error adding request to community:", error);
    throw error;
  }
}

export async function approveMemberToCommunity(
  communityId: string,
  memberId: string,
  pathName: string
) {
  try {
    connectToDB();

    // Find the community by its unique id
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    // Find the user by their unique id
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user has a request
    if (!community.requests.includes(user._id)) {
      throw new Error("User does not have a request to join the community");
    }

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    //Remove the request from the community
    await Community.updateOne(
      { _id: community._id },
      { $pull: { requests: user._id } }
    );

    // Add the user's _id to the members array in the community
    community.members.push(user._id);
    await community.save();

    // Add the community's _id to the communities array in the user
    user.communities.push(community._id);
    await user.save();

    revalidatePath(pathName);
  } catch (error) {
    // Handle any errors
    console.error("Error adding member to community:", error);
    throw error;
  }
}

export async function declineRequestCommunity(
  userId: string,
  communityId: string,
  pathName: string
) {
  try {
    connectToDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error("User not found");
    }

    if (!communityIdObject) {
      throw new Error("Community not found");
    }

    // Remove the user's _id from the requests array in the community
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { requests: userIdObject._id } }
    );

    revalidatePath(pathName);
  } catch (error) {
    // Handle any errors
    console.error("Error removing request from community:", error);
    throw error;
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string,
  pathName?: string
) {
  try {
    connectToDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error("User not found");
    }

    if (!communityIdObject) {
      throw new Error("Community not found");
    }

    // Remove the user's _id from the members array in the community
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    if (pathName) revalidatePath(pathName);
  } catch (error) {
    // Handle any errors
    console.error("Error removing user from community:", error);
    throw error;
  }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string,
  status: string,
  bio: string
) {
  try {
    connectToDB();

    // Find the community by its _id and update the information
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image, status, bio }
    );

    if (!updatedCommunity) {
      throw new Error("Community not found");
    }

    return updatedCommunity;
  } catch (error) {
    // Handle any errors
    console.error("Error updating community information:", error);
    throw error;
  }
}

export async function hardDeleteCommunity(
  communityId: string,
  pathName: string
) {
  try {
    connectToDB();

    // Find the community by its ID and delete it
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error("Community not found");
    }

    // Delete all threads associated with the community
    await Entry.deleteMany({ community: deletedCommunity._id });

    // Find all users who are part of the community
    const communityUsers = await User.find({
      communities: deletedCommunity._id,
    });

    // Remove the community from the 'communities' array for each user
    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(deletedCommunity._id);
      return user.save();
    });

    await Promise.all(updateUserPromises);

    revalidatePath(pathName);
  } catch (error) {
    console.error("Error deleting community: ", error);
    throw error;
  }
}

//Write a function to find a user by their username
export async function findDuplicateCommunityByUsername(
  username: string,
  communityId: any
) {
  try {
    connectToDB();

    // Create an initial query object to filter users.
    let query: FilterQuery<typeof Community> = {
      username: username,
    };

    communityId && communityId.trim() !== ""
      ? (query.id = { $ne: communityId })
      : null; // Exclude the current user from the results.

    const communityDuplicate = await Community.findOne(query);
    const userDuplicate = await User.findOne({ username: username });

    return communityDuplicate || userDuplicate;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

//Write a function to a book queue to a community
export async function addBookQueueToCommunity(
  communityId: string,
  bookQueue: any,
  startDate: Date,
  endDate: Date,
  path: string
) {
  try {
    connectToDB();

    // Find the community by its unique id
    const community = await Community.findOne({ _id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    const newBookQueue = new BomQueue({
      communityId: community._id,
      startDate: startDate,
      endDate: endDate,
      bookSessions: [],
    });

    //Save the book sessions
    for (var item of bookQueue) {
      //Handle fetch or create book
      const book = await updateOrCreateBook(item);

      const newBookSession = new BookSession({
        bookId: book._id,
        communityId: community._id,
        startDate: startDate,
        endDate: endDate,
        votes: [],
      });

      const sessionResponse = await newBookSession.save();

      newBookQueue.bookSessions.push(sessionResponse);
    }

    // Add the book queue to the community
    await newBookQueue.save();

    community.queues.push(newBookQueue._id);

    await community.save();

    revalidatePath(path);

    // return newBookQueue;
  } catch (error) {
    // Handle any errors
    console.error("Error adding book queue to community:", error);
    throw error;
  }
}

export async function updateBookInQueue(
  queueId: string,
  previousBooksessionId: any,
  book: any
) {
  try {
    connectToDB();

    // Find the queue by its unique id
    const queue = await BomQueue.findOne({ id: queueId });

    if (!queue) {
      throw new Error("Queue not found");
    }

    //Replace the booksession with the new one in the same index of the array

    // Find the book by its unique id
    const bookResponse = await updateOrCreateBook(book);

    const newBookSession = new BookSession({
      bookId: bookResponse._id,
      communityId: queue.communityId,
      startDate: queue.startDate,
      endDate: queue.endDate,
      votes: [],
    });

    const sessionResponse = await newBookSession.save();

    const bookSessionIndex = queue.bookSessions.indexOf(previousBooksessionId);

    queue.bookSessions[bookSessionIndex] = sessionResponse._id;

    // Save the updated queue
    await queue.save();

    // return queue;
  } catch (error) {
    // Handle any errors
    console.error("Error updating book in queue:", error);
    throw error;
  }
}

export async function updateQueueSchedule(
  queueId: string,
  startDate: Date,
  endDate: Date
) {
  try {
    connectToDB();

    // Find the queue by its unique id
    const queue = await BomQueue.findOne({ id: queueId });

    if (!queue) {
      throw new Error("Queue not found");
    }

    // Update the queue with the new start and end dates
    queue.startDate = startDate;
    queue.endDate = endDate;

    // Save the updated queue
    await queue.save();

    return queue;
  } catch (error) {
    // Handle any errors
    console.error("Error updating queue schedule:", error);
    throw error;
  }
}

export async function publishBookQueue(
  queueId: string,
  userId?: string,
  publishBlurb?: string
) {
  try {
    connectToDB();

    // Find the queue by its unique id
    const queue = await BomQueue.findOne({ id: queueId }).populate({
      path: "communityId",
      model: Community,
    });

    if (!queue) {
      throw new Error("Queue not found");
    }

    if (queue.startDate < new Date()) {
      queue.status = "Voting";
    } else {
      queue.status = "Published";
    }

    // Save the updated queue
    await queue.save();

    const createEntry = await Entry.create({
      text: publishBlurb,
      author: userId,
      community: queue.communityId,
      queueId: queue._id,
    });

    await Community.findByIdAndUpdate(queue.communityId, {
      $push: { threads: createEntry._id },
    });

    return queue;
  } catch (error) {
    // Handle any errors
    console.error("Error publishing queue:", error);
    throw error;
  }
}

export async function startReadingBookQueue(
  queueId: string,
  bookSessionId: string,
  startDate: Date,
  endDate: Date
) {
  try {
    connectToDB();

    // Find the queue by its unique id
    const queue = await BomQueue.findOne({ id: queueId });

    if (!queue) {
      throw new Error("Queue not found");
    }

    // Update the queue status to 'completed'
    queue.status = "Completed";

    //Add the book session as the current book of the month
    const bom = new Bom({
      bookSession: bookSessionId,
      community: queue.communityId,
      startDate: startDate,
      endDate: endDate,
    });

    //Save the new book of the month
    await bom.save();

    // Save the updated queue
    await queue.save();

    return queue;
  } catch (error) {
    // Handle any errors
    console.error("Error publishing queue:", error);
    throw error;
  }
}

export async function deleteQueue(queueId: string) {
  try {
    connectToDB();

    // Find the queue by its unique id
    const queue = await BomQueue.findOne({ id: queueId });

    if (!queue) {
      throw new Error("Queue not found");
    }

    queue.status = "Cancelled";

    // Delete the queue
    await queue.save();
  } catch (error) {
    // Handle any errors
    throw error;
  }
}
