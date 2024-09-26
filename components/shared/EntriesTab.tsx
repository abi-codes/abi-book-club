import { fetchUserPosts } from "@/lib/actions/user.actions";
import React from "react";
import { redirect } from "next/navigation";
import EntryCard from "../cards/EntryCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const EntriesTab = async ({ currentUserId, accountId, accountType }: Props) => {
  //TODO: Fetch profile threads

  let result: any;
  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
    console.log("Community posts", result);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.length === 0 ? (
        <p className="no-result">No entries found</p>
      ) : (
        result.threads.map((entry: any) => (
          <>
            <EntryCard
              key={entry._id}
              id={entry._id}
              currentUserId={currentUserId.toString()}
              parentId={entry.parentId}
              content={entry.text}
              author={
                accountType === "User"
                  ? {
                      name: result.name,
                      image: "",
                      id: result.id,
                      _id: result._id,
                    }
                  : {
                      name: entry.author.name,
                      image: entry.author.image,
                      id: entry.author.id,
                      _id: entry.author._id,
                    }
              }
              community={
                entry.community && entry.community.name
                  ? {
                      _id: entry.community._id,
                      id: entry.community.id,
                      name: entry.community.name,
                      image: entry.community.image,
                    }
                  : null
              }
              createdAt={entry.createdAt}
              comments={JSON.parse(JSON.stringify(entry.children))}
              likes={JSON.parse(JSON.stringify(entry.likes))}
            />
            <hr className="bg-gray-100 dark:bg-dark-4" />
          </>
        ))
      )}
    </section>
  );
};

export default EntriesTab;
