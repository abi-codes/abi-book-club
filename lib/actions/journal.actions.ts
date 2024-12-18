"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Entry from "../models/entry.model";
import Community from "../models/community.model";
import Like from "../models/like.model";
import { IEntry } from "../types/entry";
import BomQueue from "../models/bomQueue.model";
import BookSession from "../models/bookSession.model";
import Book from "../models/book.model";
import {
  createThreadLike,
  createThreadReply,
  removeThreadLike,
  removeThreadReply,
} from "./activity.action";
import Bom from "../models/bom.model";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = await Entry.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    })
    .populate({
      path: "likes", // Populate the likes field
      model: Like,
    })
    .populate({
      path: "queueId",
      model: BomQueue,
      populate: [
        {
          path: "bookSessions",
          model: BookSession,
          populate: {
            path: "bookId",
            model: Book,
          },
        },
      ],
    })
    .populate({
      path: "bomId",
      model: Bom,
      populate: {
        path: "bookSession",
        model: BookSession,
        populate: {
          path: "bookId",
          model: Book,
        },
      },
    });

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalPostsCount = await Entry.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = <IEntry[]>postsQuery;

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts: JSON.parse(JSON.stringify(posts)), isNext };
}

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createEntry({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne({ _id: communityId });

    const createdEntry = await Entry.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdEntry._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdEntry._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

export async function fetchAllChildEntries(threadId: string): Promise<any[]> {
  const childThreads = await Entry.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildEntries(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteEntry(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Entry.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildEntries(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    //Remove thread comment activity
    if (mainThread.parentId) {
      removeThreadReply(mainThread.author._id.toString(), id);
    }

    // Recursively delete child threads and their descendants
    await Entry.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchEntryById(threadId: string) {
  connectToDB();

  try {
    const thread = await Entry.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "queueId",
        model: BomQueue,
        populate: [
          {
            path: "bookSessions",
            model: BookSession,
            populate: {
              path: "bookId",
              model: Book,
            },
          },
        ],
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        options: { sort: { createdAt: -1 } }, // Sort children by createdAt field in descending order
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Entry, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .populate({
        path: "likes", // Populate the likes field
        model: Like,
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommentToEntry(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Entry.findOne({ id: threadId });

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = new Entry({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    await createThreadReply(userId, savedCommentThread._id);

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}

export async function likeEntry(threadId: string, userId: any, path: string) {
  connectToDB();

  try {
    //Create like entry

    // Find the thread by its ID
    const thread = await Entry.findById(threadId).populate({
      path: "likes", // Populate the likes field
      model: Like,
    });

    if (!thread) {
      throw new Error("Thread not found");
    }

    const likeCheck = thread.likes.find((l: any) => l.user == userId);

    // Check if the user has already liked the thread
    if (likeCheck) {
      // Remove the user's ID from the thread's likes array
      thread.likes.pull(likeCheck);
      // Delete the like record from the database
      await Like.findByIdAndDelete(likeCheck._id);

      //Remove thread like activity
      await removeThreadLike(userId, threadId);
    } else {
      // Create like record
      const likeEntry = new Like({
        user: userId,
        createdAt: Date.now(),
      });

      const savedLikeEntry = await likeEntry.save();
      // Add the response _id to the thread's likes array
      thread.likes.push(savedLikeEntry._id);

      //Create thread like acitivity
      await createThreadLike(userId, threadId);
    }

    // Save the updated thread to the database
    await thread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while liking thread:", err);
    throw new Error("Unable to like thread");
  }
}
