import Activity from "../models/activity.model";
import Community from "../models/community.model";
import Entry from "../models/entry.model";

export async function fetchActivities(userId: string) {
  const activities = await Activity.find({ recieverUser: userId }).sort({
    createdAt: -1,
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
    creatorUser,
    recieverUser,
    creatorCommunity,
    objectId,
    notificationType,
  });

  await activity.save();
}

export async function createThreadLike(creatorUser: string, objectId: string) {
  const recieverUser = await Entry.findOne({ id: objectId }).select("author");

  await createActivity(recieverUser.author._id, objectId, "like", creatorUser);
}

export async function createThreadReply(creatorUser: string, objectId: string) {
  const recieverUser = await Entry.findOne({ id: objectId }).select("author");

  await createActivity(recieverUser.author._id, objectId, "reply", creatorUser);
}

export async function createQueuePublish(
  creatorCommunity: string,
  objectId: string
) {
  const communityMembers = await Community.findOne({ id: objectId }).select(
    "members"
  );

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
