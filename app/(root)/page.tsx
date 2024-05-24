import CommunityCard from "@/components/cards/CommunityCard";

import { fetchCommunities } from "@/lib/actions/community.actions";

async function Page() {
  // Fetch communities
  const result = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  const activeCommunities = result.communities
    ? result.communities.filter((c) => c?.status === "active")
    : [];

  return (
    <section>
      <div className="flex justify-between align-middle">
        <div className="flex-col">
          <h1 className="head-text text-black dark:text-white leading-none">
            Find Your Book Club
          </h1>
          <h1 className="head-text cursive">Community</h1>
          <img
            src="\assets\underline.png"
            alt="Text Underline"
            width="150px"
            height="10px"
            className="underline"
          ></img>
          <p className="mt-7 text-black dark:text-white">
            Hop into a book club and access curated content by your favorite
            creators. Heck, you could even create your own!
          </p>
        </div>
        <div className="flex items-center"></div>
      </div>
      {/* Search Bar*/}

      {/* Dialog for community form */}

      <div className="mt-9 flex flex-wrap gap-4">
        {activeCommunities.length === 0 ? (
          <p className="no-result">No Clubs</p>
        ) : (
          <>
            {activeCommunities.map((community) => (
              <CommunityCard
                community={JSON.parse(JSON.stringify(community))}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}

export default Page;
