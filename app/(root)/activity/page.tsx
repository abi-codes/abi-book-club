import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { timeDifferenceForDate } from "@/lib/utils";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.user.onboarded) redirect("/onboarding");

  //getActivity
  const activity = await getActivity(userInfo.user._id);

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
            activity.type === "reply" ? (
              <Link key={activity._id} href={`/journal/${activity.parentId}`}>
                <article className="activity-card justify-between">
                  <div className="flex gap-2">
                    <Image
                      src={activity.author.image}
                      alt="Profile picture"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-gray-800 dark:text-light-1">
                      <span className="mr-1 text-red-800">
                        {activity.author.name}
                      </span>{" "}
                      replied to your thread
                    </p>
                  </div>
                  <p className="!text-small-regular text:slate-600 dark:text-gray-600">
                    {timeDifferenceForDate(activity.createdAt)} ago
                  </p>
                </article>
              </Link>
            ) : activity.type === "like" ? (
              <Link key={activity._id} href={`/journal/${activity.parentId}`}>
                <article className="activity-card justify-between">
                  <div className="flex gap-3">
                    <Image
                      src={activity.user.image}
                      alt="Profile picture"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-gray-800 dark:text-light-1">
                      <span className="mr-1 text-red-800">
                        {activity.user.name}
                      </span>{" "}
                      liked your thread
                    </p>
                  </div>
                  <p className="!text-small-regular text-gray-400 dark:text-gray-600">
                    {timeDifferenceForDate(activity.createdAt)} ago
                  </p>
                </article>
              </Link>
            ) : (
              <Link key={activity._id} href={`/journal/${activity.parentId}`}>
                <article className="activity-card justify-between">
                  <div className="flex gap-3">
                    <Image
                      src={activity.communityId.image}
                      alt="Profile picture"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-gray-800 dark:text-light-1">
                      <span className="mr-1 text-red-800">
                        {activity.communityId.name}
                      </span>{" "}
                      published a new queue
                    </p>
                  </div>
                  <p className="!text-small-regular text-gray-400 dark:text-gray-600">
                    {/* {timeDifferenceForDate(activity.createdAt)} ago */}
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
