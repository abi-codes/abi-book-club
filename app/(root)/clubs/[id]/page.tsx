import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { communityTabs } from "@/constants";

import ProfileHeader from "@/components/shared/ProfileHeader";
import EntriesTab from "@/components/shared/EntriesTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import BoMTab from "@/components/shared/BoMTab";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.user.onboarded) redirect("/onboarding");

  const communityDetails = await fetchCommunityDetails(params.id);
  // check if current user is already a member of the community

  const memberCheck = communityDetails?.members?.some(
    (m: any) => m.id === user.id
  );

  const requestCheck = communityDetails?.requests?.some(
    (m: any) => m.id === user.id
  );

  const isMember = memberCheck ? true : false;

  const isRequester = requestCheck ? true : false;

  const isOwner = user.id === communityDetails?.createdBy?.id;

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails.id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        isRequester={isRequester}
        isMember={isMember}
        isOwner={isOwner ? true : false}
        type="Community"
      />

      <div className="mt-9">
        {isOwner ? (
          <Tabs defaultValue="entries" className="w-full">
            <TabsList className="tab">
              {communityTabs.map((tab: any) => (
                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />

                  <p className="max-sm:hidden">{tab.label}</p>

                  {tab.label === "Entries" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {communityDetails?.threads?.length}
                    </p>
                  )}

                  {tab.label === "Members" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {communityDetails?.members?.length}
                    </p>
                  )}

                  {tab.label === "Requests" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {communityDetails?.requests?.length}
                    </p>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="bom" className="w-full text-light-1">
              {/* <BoMTab
                currentUserId={userInfo._id}
                communityId={communityDetails._id}
                queues={JSON.parse(JSON.stringify(communityDetails.queues))}
              /> */}
            </TabsContent>
            <TabsContent value="entries" className="w-full text-light-1">
              <EntriesTab
                currentUserId={userInfo.user._id}
                accountId={communityDetails._id}
                accountType="Community"
              />
            </TabsContent>
            <TabsContent value="members" className="w-full text-light-1">
              <section className="mt-9 flex flex-col gap-10">
                {communityDetails?.members?.length === 0 ? (
                  <p className="no-result">No members found</p>
                ) : (
                  communityDetails?.members?.map((member: any) => (
                    <UserCard
                      key={member.id}
                      id={member.id}
                      name={member.name}
                      username={member.username}
                      imgUrl={member.image}
                      communityId={communityDetails.id}
                      personType="Member"
                    />
                  ))
                )}
              </section>
            </TabsContent>
            <TabsContent value="requests" className="w-full text-light-1">
              <section className="mt-9 flex flex-col gap-10">
                {communityDetails?.requests?.length === 0 ? (
                  <p className="no-result">No requests found</p>
                ) : (
                  communityDetails?.requests?.map((member: any) => (
                    <UserCard
                      key={member.id}
                      id={member.id}
                      name={member.name}
                      username={member.username}
                      imgUrl={member.image}
                      communityId={communityDetails.id}
                      personType="Request"
                    />
                  ))
                )}
              </section>
            </TabsContent>
          </Tabs>
        ) : (
          <EntriesTab
            currentUserId={userInfo._id}
            accountId={communityDetails._id}
            accountType="Community"
          />
        )}
      </div>
    </section>
  );
}

export default Page;
