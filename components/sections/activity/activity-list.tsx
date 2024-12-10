"use client";

import ActivityCard from "@/components/cards/activity-cards/activity-card";
import { timeDifferenceForDate } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  activity: any[];
}

const ActivityList = ({ activity }: Props) => {
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activityList, setActivityList] = useState<any>(activity);

  return (
    <section className="flex flex-col gap-5">
      {activityList.today.length > 0 && (
        <section className="flex flex-col gap-3">
          <h1 className="head-text text-black dark:text-white leading-none mb-1">
            Today
          </h1>
          {activityList.today.map((activity: any) => (
            <ActivityCard key={activity._id} activity={activity} />
          ))}
        </section>
      )}
      {activityList.month.length > 0 && (
        <section className="flex flex-col gap-3">
          <h1 className="head-text text-black dark:text-white leading-none mb-1">
            This month
          </h1>
          {activityList.month.map((activity: any) => (
            <ActivityCard key={activity._id} activity={activity} />
          ))}
        </section>
      )}
      {activityList.year.length > 0 && (
        <section className="flex flex-col gap-3">
          <h1 className="head-text text-black dark:text-white leading-none mb-1">
            Older
          </h1>
          {activityList.year.map((activity: any) => (
            <ActivityCard key={activity._id} activity={activity} />
          ))}
        </section>
      )}
    </section>
  );
};

export default ActivityList;
