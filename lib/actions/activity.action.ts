import Activity from "../models/activity.model";
import Community from "../models/community.model";
import Entry from "../models/entry.model";
import User from "../models/user.model";

export async function fetchActivities(userId: string) {
  const activities = await Activity.find({ recieverUser: userId })
    .populate({
      path: "creatorUser",
      model: User,
      select: "name image _id",
    })
    .populate({
      path: "creatorCommunity",
      model: Community,
      select: "name image _id",
    })
    .sort({
      createdDate: "desc",
    });

  return activities;
}

export async function createActivity(
  recieverUser: string,
  objectId: string,
  notificationType: string,
  creatorUser?: string,
  creatorCommunity?: string
) {
  const activity = new Activity({
    creatorUser: creatorUser ? creatorUser : undefined,
    recieverUser,
    creatorCommunity: creatorCommunity ? creatorCommunity : undefined,
    objectId,
    notificationType,
  });

  await activity.save();
}

export async function removeActivity(
  recieverUser: string,
  objectId: string,
  notificationType: string,
  creatorUser?: string,
  creatorCommunity?: string
) {
  const activity = await Activity.findOne({
    recieverUser,
    objectId,
    notificationType,
    creatorUser,
    creatorCommunity,
  });

  await Activity.findByIdAndDelete(activity._id);
}

export async function removeThreadLike(creatorUser: string, objectId: string) {
  const recieverUser = await Entry.findOne({ _id: objectId }).select("author");

  await removeActivity(recieverUser.author._id, objectId, "like", creatorUser);
}

export async function createThreadLike(creatorUser: string, objectId: string) {
  const recieverUser = await Entry.findOne({ _id: objectId }).select("author");

  await createActivity(recieverUser.author._id, objectId, "like", creatorUser);
}

export async function removeThreadReply(creatorUser: string, objectId: string) {
  const recieverUser = await Entry.findOne({ _id: objectId }).select("author");

  await removeActivity(recieverUser.author._id, objectId, "reply", creatorUser);
}

export async function createThreadReply(creatorUser: string, objectId: string) {
  const recieverUser = await Entry.findOne({ _id: objectId }).select("author");

  await createActivity(recieverUser.author._id, objectId, "reply", creatorUser);
}

export async function createQueuePublish(
  creatorCommunity: string,
  objectId: string
) {
  const communityMembers = await Community.findOne({
    _id: creatorCommunity,
  }).select("members");

  for (const member of communityMembers.members) {
    await createActivity(
      member,
      objectId,
      "queue",
      undefined,
      creatorCommunity
    );
  }
}

export async function createBomPublish(
  creatorCommunity: string,
  objectId: string
) {
  const communityMembers = await Community.findOne({
    id: creatorCommunity,
  }).select("members");

  for (const member of communityMembers.members) {
    await createActivity(member, objectId, "bom", undefined, creatorCommunity);
  }
}

export async function createVote(creatorUser: string, objectId: string) {
  const entry = await Entry.findOne({
    id: objectId,
  }).select("author");

  await createActivity(
    entry.author._id,
    objectId,
    "vote",
    creatorUser,
    undefined
  );
}
