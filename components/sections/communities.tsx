import React from "react";
import CommunityCard from "../cards/CommunityCard";
import { fetchCommunities } from "@/lib/actions/community.actions";

const Communities = async () => {
  // Fetch communities
  const result = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 4,
  });

  const activeCommunities = result.communities
    ? result.communities.filter((c) => c?.status === "active")
    : [];

  return (
    <section className="flex flex-col gap-2">
      <h3 className="head-text text-dark-2 dark:text-light-">
        Clubs you may be interest in
      </h3>
      <div className="mt-9 flex flex-wrap gap-4">
        {activeCommunities.map((community) => (
          <CommunityCard community={JSON.parse(JSON.stringify(community))} />
        ))}
      </div>
    </section>
  );
};

export default Communities;
