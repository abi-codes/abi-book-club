import {
  fetchUser,
  fetchUserFollowRequests,
  getActivity,
} from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { timeDifferenceForDate } from "@/lib/utils";
import { fetchActivities } from "@/lib/actions/activity.action";
import Followers from "@/components/sections/activity/followers";
import Activity from "@/components/sections/activity/activity";

async function Page() {
  const user = await currentUser();

  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.user.onboarded) redirect("/onboarding");

  //getActivity
  const activity = await fetchActivities(userInfo.user._id);
  const initialFollowers = await fetchUserFollowRequests({
    userId: userInfo.user._id,
    pageNumber: 1,
  });

  return (
    <Activity
      userId={userInfo.user._id.toString()}
      initialActivity={JSON.parse(JSON.stringify(activity))}
      initialRequests={initialFollowers.users}
      initialHasRequestsNext={initialFollowers.hasNext}
    />
  );
}

export default Page;
