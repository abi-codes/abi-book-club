import { timeDifferenceForDate } from "@/lib/utils";
import Link from "next/link";
import React from "react";
interface Props {
  activity: any;
}
const ActivityCard = ({ activity }: Props) => {
  const handleMessage = () => {
    switch (activity.notificationType) {
      case "reply":
        return "commented on your entry";
      case "like":
        return "liked your entry";
      case "queue":
        return "published a new book of the month queue";
      case "vote":
        return "requested to follow you";
      case "bom":
        return "has added a new book of the month";
      default:
        return "";
    }
  };

  const handleProfileImage = () => {
    switch (activity.notificationType) {
      case "reply":
        return activity.creatorUser.image;
      case "like":
        return activity.creatorUser.image;
      case "queue":
        return activity.creatorCommunity.image;
      case "vote":
        return activity.creatorUser.image;
      case "bom":
        return activity.creatorCommunity.image;
      default:
        return activity.creatorUser.image;
    }
  };

  const handleProfileName = () => {
    switch (activity.notificationType) {
      case "reply":
        return activity.creatorUser.name;
      case "like":
        return activity.creatorUser.name;
      case "queue":
        return activity.creatorCommunity.name;
      case "vote":
        return activity.creatorUser.name;
      case "bom":
        return activity.creatorCommunity.name;
      default:
        return activity.creatorUser.name;
    }
  };
  return (
    <Link key={activity._id} href={`/journal/${activity.objectId}`}>
      <article className="activity-card justify-between">
        <div className="flex gap-2">
          <img
            src={handleProfileImage()}
            alt="Profile picture"
            width={20}
            height={20}
            className="rounded-full object-cover"
          />
          <p className="!text-small-regular text-gray-800 dark:text-light-1">
            <span className="mr-1 text-red-800">{handleProfileName()}</span>{" "}
            {handleMessage()}
          </p>
        </div>
        <p className="!text-small-regular text:slate-600 dark:text-gray-600">
          {timeDifferenceForDate(new Date(activity.createdDate))} ago
        </p>
      </article>
    </Link>
  );
};

export default ActivityCard;
