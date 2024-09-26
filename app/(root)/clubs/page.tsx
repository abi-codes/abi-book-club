import CommunityCard from "@/components/cards/CommunityCard";
import Community from "@/components/forms/Community";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.user.onboarded) redirect("/onboarding");

  // Fetch communities
  const result = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  const activeCommunities = result.communities.filter(
    (c) => c?.status === "active"
  );

  return (
    <section>
      <Dialog>
        <div className="flex justify-between align-middle">
          <h1 className="head-text">Book Clubs</h1>
          <div className="flex items-center">
            <DialogTrigger asChild>
              <button className="community-card_btn bg-slate-800">
                Create
              </button>
            </DialogTrigger>
          </div>
        </div>
        {/* Search Bar*/}

        {/* Dialog for community form */}
        <DialogContent className="content-center sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add book club</DialogTitle>
            <DialogDescription>
              Add your book club. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Community
            community={{
              id: "",
              username: "",
              name: "",
              image: "",
              bio: "",
              ownerUserId: userInfo.user.id,
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="mt-9 flex flex-wrap gap-4">
        {activeCommunities.length === 0 ? (
          <p className="no-result">No Clubs</p>
        ) : (
          <>
            {activeCommunities.map((community) => (
              <CommunityCard
                community={JSON.parse(JSON.stringify(community))}
                key={community?.id}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}

export default Page;
