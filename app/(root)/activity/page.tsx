import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { timeDifferenceForDate } from "@/lib/utils";
import { fetchActivities } from "@/lib/actions/activity.action";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.user.onboarded) redirect("/onboarding");

  //getActivity
  const activity = await fetchActivities(userInfo.user._id);
  console.log(activity);
  return (
    <section>
      <h1 className="head-text text-black dark:text-white leading-none mb-1">
        Catch up with
        <br />
        your Journal
      </h1>
      <h1 className="head-text cursive">Entries</h1>
      <img
        src="\assets\underline.png"
        alt="Text Underline"
        width="110px"
        height="10px"
        className="underline"
      ></img>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 &&
          activity.map((activity: any) =>
            activity.notificationType === "reply" ? (
              <Link key={activity._id} href={`/journal/${activity.objectId}`}>
                <article className="activity-card justify-between">
                  <div className="flex gap-2">
                    <Image
                      src={activity.creatorUser.image}
                      alt="Profile picture"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-gray-800 dark:text-light-1">
                      <span className="mr-1 text-red-800">
                        {activity.creatorUser.name}
                      </span>{" "}
                      commented on your entry
                    </p>
                  </div>
                  <p className="!text-small-regular text:slate-600 dark:text-gray-600">
                    {timeDifferenceForDate(activity.createdDate)} ago
                  </p>
                </article>
              </Link>
            ) : activity.notificationType === "like" ? (
              <Link key={activity._id} href={`/journal/${activity.objectId}`}>
                <article className="activity-card justify-between">
                  <div className="flex gap-3">
                    <Image
                      src={activity.creatorUser.image}
                      alt="Profile picture"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-gray-800 dark:text-light-1">
                      <span className="mr-1 text-red-800">
                        {activity.creatorUser.name}
                      </span>{" "}
                      liked your entry
                    </p>
                  </div>
                  <p className="!text-small-regular text-gray-400 dark:text-gray-600">
                    {timeDifferenceForDate(activity.createdDate)} ago
                  </p>
                </article>
              </Link>
            ) : activity.notificationType === "queue" ? (
              <Link key={activity._id} href={`/journal/${activity.objectId}`}>
                <article className="activity-card justify-between">
                  <div className="flex gap-3">
                    <Image
                      src={activity.creatorCommunity.image}
                      alt="Profile picture"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-gray-800 dark:text-light-1">
                      <span className="mr-1 text-red-800">
                        {activity.creatorCommunity.name}
                      </span>{" "}
                      published a new book of the month queue
                    </p>
                  </div>
                  <p className="!text-small-regular text-gray-400 dark:text-gray-600">
                    {timeDifferenceForDate(activity.createdDate)} ago
                  </p>
                </article>
              </Link>
            ) : activity.notificationType === "vote" ? (
              <Link key={activity._id} href={`/journal/${activity.objectId}`}>
                <article className="activity-card justify-between">
                  <div className="flex gap-3">
                    <Image
                      src={activity.creatorUser.image}
                      alt="Profile picture"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-gray-800 dark:text-light-1">
                      <span className="mr-1 text-red-800">
                        {activity.creatorUser.name}
                      </span>{" "}
                      has voted
                    </p>
                  </div>
                  <p className="!text-small-regular text-gray-400 dark:text-gray-600">
                    {timeDifferenceForDate(activity.createdDate)} ago
                  </p>
                </article>
              </Link>
            ) : (
              <Link key={activity._id} href={`/journal/${activity.objectId}`}>
                <article className="activity-card justify-between">
                  <div className="flex gap-3">
                    <Image
                      src={activity.creatorCommunity.image}
                      alt="Profile picture"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-gray-800 dark:text-light-1">
                      <span className="mr-1 text-red-800">
                        {activity.creatorCommunity.name}
                      </span>{" "}
                      has added a new book of the month
                    </p>
                  </div>
                  <p className="!text-small-regular text-gray-400 dark:text-gray-600">
                    {timeDifferenceForDate(activity.createdDate)} ago
                  </p>
                </article>
              </Link>
            )
          )}

        {/* : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )} */}
      </section>
    </section>
  );
}

export default Page;
