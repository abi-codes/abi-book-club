import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import EntriesTab from "@/components/shared/EntriesTab";

import Bookshelf from "@/components/shared/Bookshelf";
import UserCard from "@/components/cards/UserCard";
import ProfileTopbar from "@/components/shared/ProfileTopbar";
import Profile from "@/components/temp-page/profile";
import OwnedProfile from "@/components/temp-page/owned-profile";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const fetchUserResponse = await fetchUser(params.id);

  if (!fetchUserResponse?.user.onboarded) redirect("/onboarding");

  const isOwner = user.id === fetchUserResponse.user.id;

  const followerCheck = fetchUserResponse.user.followers?.find(
    (follower: any) => follower.id === user.id
  );

  const isFollowing = followerCheck ? true : false;

  return (
    <section>
      {isOwner ? (
        <OwnedProfile
          id={params.id}
          isFollowing={isFollowing}
          userInfo={JSON.parse(JSON.stringify(fetchUserResponse.user))}
          isOwner={isOwner}
        />
      ) : (
        <Profile
          id={params.id}
          isFollowing={isFollowing}
          userInfo={JSON.parse(JSON.stringify(fetchUserResponse.user))}
          isOwner={isOwner}
        />
      )}
    </section>
  );
}

export default Page;
