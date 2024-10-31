import EntryCard from "@/components/cards/EntryCard";

import { fetchPosts } from "@/lib/actions/journal.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();

  let userInfo: any = null;

  if (user) userInfo = await fetchUser(user?.id);

  return (
    <>
      <div className="flex justify-end align-middle">
        <div className="flex items-center">
          <Link href={`/journal/create`}>
            <button className="community-card_btn bg-red-800">Create</button>
          </Link>
        </div>
      </div>

      <section className="mt-9 flex flex-col gap-10">
        <Suspense fallback={<div>Loading journal entries...</div>}>
          {result.posts.length === 0 ? (
            <p className="no-result">No entries found</p>
          ) : (
            <>
              {result.posts.map((post: any, index: number) => (
                <>
                  <EntryCard
                    key={post._id}
                    id={post._id.toString()}
                    queueId={post?.queueId}
                    currentUserId={userInfo?.user?._id || ""}
                    content={post.text}
                    author={{
                      name: post.author.name,
                      image: post.author.image,
                      id: post.author.id,
                      _id: post.author._id,
                    }}
                    community={
                      post.community
                        ? {
                            _id: post.community._id,
                            id: post.community.id,
                            name: post.community.name,
                            image: post.community.image,
                          }
                        : null
                    }
                    createdAt={post.createdAt}
                    comments={JSON.parse(JSON.stringify(post.children))}
                    likes={JSON.parse(JSON.stringify(post.likes))}
                  />
                  <hr className="bg-gray-100 dark:bg-dark-4" />
                </>
              ))}
            </>
          )}
        </Suspense>
      </section>
    </>
  );
}
