"use server";

import { FilterQuery, SortOrder, Schema, model } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Entry from "../models/entry.model";
import User from "../models/user.model";
import Like from "../models/like.model";
import { connectToDB } from "../mongoose";
import Address from "../models/address.model";
import Bookshelf from "../models/bookshelf.model";
import Book from "../models/book.model";
import BookReview from "../models/bookReview.model";
import { IUser } from "../types/user";
import { IBookshelf } from "../types/bookshelf";
import BomQueue from "../models/bomQueue.model";
import BookSession from "../models/bookSession.model";

export async function fetchAllUserDetails(userId: string) {
  try {
    connectToDB();

    const response = await User.findOne({ id: userId })
      .populate({
        path: "communities",
        model: Community,
      })
      .populate({
        path: "address",
        model: Address,
      })
      .populate({
        path: "bookshelf",
        model: Bookshelf,
        populate: [
          {
            path: "bookId",
            model: Book,
          },
          {
            path: "bookReviewId",
            model: BookReview,
            populate: {
              path: "createdBy",
              model: User,
            },
          },
        ],
      })
      .populate({
        path: "following",
        model: User,
        select: "name surname username image id",
      })
      .populate({
        path: "followers",
        model: User,
        select: "name surname username image id",
      });

    return <IUser>response;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    const response = await User.findOne({ id: userId })
      .populate({
        path: "communities",
        model: Community,
      })
      .populate({
        path: "address",
        model: Address,
      })
      .populate({
        path: "bookshelf",
        model: Bookshelf,
        populate: [
          {
            path: "bookId",
            model: Book,
          },
          {
            path: "bookReviewId",
            model: BookReview,
            populate: {
              path: "createdBy",
              model: User,
              select: "name image id",
            },
          },
        ],
        options: {
          skip: 0,
          sort: { createdDate: "desc" },
          limit: 6,
        },
      })
      .populate({
        path: "following",
        model: User,
        select: "name surname username image id",
      })
      .populate({
        path: "followers",
        model: User,
        select: "name surname username image id",
      });
    var returnResponse = <IUser>response;

    return {
      user: returnResponse,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  userId: string;
  username: string;
  name: string;
  email: string;
  surname?: string;
  bio: string;
  image: string;
  path: string;
  occupation?: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  email,
  path,
  username,
  image,
  occupation,
  surname,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        email,
        bio,
        image,
        occupation,
        surname,
        onboarded: true,
        status: "active",
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

interface UpdateParams {
  userId: string;
  username?: string | null;
  name?: string | null;
  surname?: string | null;
  bio?: string | null;
  image?: string | null;
  backgroundImage?: string | null;
  phoneNumber?: string | null;
  path?: string | null;
  occupation?: string | null;
  visibility?: boolean | null;
  status?: string | null;
  onboarded?: boolean | null;
}

export async function updateUserDetails({
  userId,
  bio,
  name,
  path,
  username,
  image,
  backgroundImage,
  phoneNumber,
  occupation,
  visibility,
  surname,
  status,
  onboarded,
}: UpdateParams) {
  connectToDB();

  const updateObject = {
    username: username ? username.toLowerCase() : null,
    name,
    bio,
    image,
    occupation,
    backgroundImage,
    phoneNumber,
    surname,
    visibility,
    status,
    onboarded,
  };

  const sanitizedUpdate = Object.fromEntries(
    Object.entries(updateObject).filter(([_, v]) => v != null)
  );

  await User.findOneAndUpdate({ id: userId }, sanitizedUpdate, {
    upsert: true,
  });
}

export async function removeUserAddress(
  addressId: string,
  userId: string,
  path: string
) {
  try {
    connectToDB();

    const user = await User.findOne({ id: userId });

    user.address.pull(addressId);

    await user.save();

    await Address.findOneAndDelete({ id: addressId });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to remove user address: ${error.message}`);
  }
}

export async function updateUserAddress(
  address: any,
  userId: string,
  path: string
) {
  try {
    connectToDB();

    //Check if we need to update the address of create the address

    if (address.id) {
      await Address.findOneAndUpdate({ id: address.id }, address, {
        upsert: true,
      });
    } else {
      const newAddress = new Address(address);
      await newAddress.save();

      const user = await User.findOne({ id: userId });

      user.address.push(newAddress._id);

      user.save();
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create/update user address: ${error.message}`);
  }
}

async function updateOrCreateBook(book: any) {
  try {
    connectToDB();
    //Check if the book already exists in the db
    const response = await Book.findOne({
      bookId: book.bookId,
      title: book.title,
      subtitle: book.subtitle,
    });

    if (!response) {
      //If it doesn't exist, create it
      const newBook = new Book(book);
      return await newBook.save();
    } else {
      return response;
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update book: ${error.message}`);
  }
}

async function updateOrCreateBookReview(
  bookId: any,
  bookReview: any,
  userId: any
) {
  try {
    connectToDB();
    //Check if the book review already exists in the db
    if (bookReview?.id) {
      const response = await BookReview.findOneAndUpdate(
        { id: bookReview?.id },
        { ...bookReview },
        { upsert: true }
      );
      return response;
    } else {
      //If it doesn't exist, create it

      const user = await User.findOne({ id: userId });

      const newReview = new BookReview({
        ...bookReview,
        bookId: bookId,
        createdBy: user._id,
      });
      return await newReview.save();
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update book review: ${error.message}`);
  }
}

export async function removeUserBookshelf(
  path: string,
  bookshelfId: string,
  userId: string
) {
  try {
    connectToDB();

    //Find the user
    const user = await User.findOne({ id: userId });

    //Find the bookshelf item
    const bookshelfItem = await Bookshelf.findOne({ id: bookshelfId });

    //Delete the review
    await BookReview.findOneAndDelete({
      id: bookshelfItem.bookReviewId,
    });

    //Delete remove the bookshelf item from the user
    user.bookshelf.pull(bookshelfItem._id);

    //Remove the bookshelf item from the db
    await Bookshelf.findOneAndDelete({ id: bookshelfId });

    //Save the user without the bookshelf item
    await user.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to remove user bookshelf: ${error.message}`);
  }
}

export async function updateUserBookshelf(
  bookshelfItem: any,
  userId: string,
  path: string
) {
  try {
    connectToDB();

    //Check if we need to update the address of create the address
    if (bookshelfItem?.id) {
      const newBookshelfItem = await Bookshelf.findOne({
        id: bookshelfItem.id,
      });

      //Update the bookshelf item with the changes
      const newBook: any = await updateOrCreateBook(bookshelfItem.book);

      if (bookshelfItem.review) {
        const newReview = await updateOrCreateBookReview(
          newBook._id,
          bookshelfItem.review,
          userId
        );

        newBookshelfItem.bookReviewId = newReview._id;
      }

      newBookshelfItem.bookId = newBook._id;
      newBookshelfItem.category = bookshelfItem.category;

      const user = await User.findOne({ id: userId });
      newBookshelfItem.userId = user._id;

      await newBookshelfItem.save();
    } else {
      //Create new bookshelf item with the book
      const newBook: any = await updateOrCreateBook(bookshelfItem.book);

      const user = await User.findOne({ id: userId });
      const newBookshelfItem = new Bookshelf({
        ...bookshelfItem,
        bookId: newBook._id,
        userId: user._id,
      });

      if (bookshelfItem.review) {
        const newReview = await updateOrCreateBookReview(
          newBook._id,
          bookshelfItem.review,
          userId
        );

        newBookshelfItem.bookReviewId = newReview._id;
      }

      const response = await newBookshelfItem.save();

      user.bookshelf.push(response._id);

      await user.save();
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create/update user bookshelf: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads: any = await User.findOne({ id: userId }).populate({
      path: "threads",
      options: { sort: { createdAt: "desc" } }, // Sort threads by createdAt field in descending order
      model: Entry,
      populate: [
        {
          path: "likes", // Populate the likes field
          model: Like,
        },
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Entry,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
        {
          path: "queueId",
          model: BomQueue,
          populate: [
            {
              path: "bookSessions",
              model: BookSession,
            },
          ],
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

export async function fetchUserCommunities(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Entry,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Entry,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching user communitties:", error);
    throw error;
  }
}

export async function fetchUserBookshelf({
  userId,
  searchString = "",
  categories = [],
  pageNumber = 1,
  pageSize = 6,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  categories?: string[];
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    const sortOptions = { createdDate: sortBy };

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof Bookshelf> = {
      userId: { $eq: userId }, // Exclude the current user from the results.
    };
    //Do aggrate search on book and authors
    if (categories && categories.length > 0) {
      query.category = { $in: categories };
    }

    // Find all threads authored by the user with the given userId
    const shelfQueryResponse = await Bookshelf.find(query)
      .populate({
        path: "bookId",
        model: Book,
      })
      .populate({
        path: "bookReviewId",
        model: BookReview,
      })
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalShelfItemsCount = await Bookshelf.countDocuments(query);
    const totalPages = Math.ceil(totalShelfItemsCount / pageSize);
    const isNext = pageNumber < totalPages;

    const returnResponse = <IBookshelf[]>shelfQueryResponse;

    return {
      bookshelf: JSON.parse(JSON.stringify(returnResponse)),
      bookShelfPageSize: pageSize,
      bookShelfHasNext: isNext,
      bookShelfTotalPages: totalPages,
      bookShelfCurrentPage: pageNumber,
    };
  } catch (error) {
    console.error("Error fetching user bookshelf:", error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Entry.find({ author: userId }).populate({
      path: "likes",
      model: Like,
      populate: {
        path: "user",
        model: User,
        select: "name image _id",
      },
    });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Entry.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    const user = await User.findOne({ _id: userId }).populate({
      path: "communities",
      model: Community,
      populate: {
        path: "queues",
        model: BomQueue,
        populate: {
          path: "communityId",
          model: Community,
          select: "name image _id",
        },
      },
    });

    const communityQueues = user.communities.reduce(
      (acc: any, community: any) => {
        return acc.concat(community.queues);
      },
      []
    );

    const likes = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.likes);
    }, []);

    const repliesWithType = replies.map((reply) => ({
      ...reply.toObject(),
      type: "reply",
    }));

    const likesWithType = likes.map((like: any) => ({
      ...like.toObject(),
      type: "like",
    }));

    const queuesWithType = communityQueues.map((queue: any) => ({
      ...queue.toObject(),
      type: "queue",
    }));

    return [...repliesWithType, ...likesWithType, ...queuesWithType];
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}

//Write a function to find a user by their username
export async function findDuplicateUserByUsername(
  username: string,
  userId: any
) {
  try {
    connectToDB();

    // Create an initial query object to filter users.
    let query: FilterQuery<typeof User> = {
      username: username,
    };

    userId && userId.trim() !== "" ? (query.id = { $ne: userId }) : null;

    const userDuplicate = await User.findOne(query);
    const communityDuplicate = await Community.findOne({ username: username });

    return userDuplicate || communityDuplicate;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

//Write a function to add a user to the list of users a user is following as well as add the user to the list of followers of the user being followed
export async function followUser(
  userId: string,
  userToFollowId: string,
  path: string
) {
  try {
    connectToDB();

    const user = await User.findOne({ id: userId });
    const userToFollow = await User.findOne({ id: userToFollowId });

    user.following.push(userToFollow._id);
    userToFollow.followers.push(user._id);

    await user.save();
    await userToFollow.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to follow user: ${error.message}`);
  }
}

//Write a function to remove a user from the list of users a user is following as well as remove the user from the list of followers of the user being followed
export async function unfollowUser(
  userId: string,
  userToUnfollowId: string,
  path: string
) {
  try {
    connectToDB();

    const user = await User.findOne({ id: userId });
    const userToUnfollow = await User.findOne({ id: userToUnfollowId });

    user.following.pull(userToUnfollow._id);
    userToUnfollow.followers.pull(user._id);

    await user.save();
    await userToUnfollow.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to unfollow user: ${error.message}`);
  }
}
