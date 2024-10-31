"use client";

import { fetchPosts } from "@/lib/actions/journal.actions";
import React, { useEffect, useState } from "react";
import { IEntry } from "@/lib/types/entry";
import { useInView } from "react-intersection-observer";
import CSEntryCard from "../cards/EntryCard/CSEntryCard";

interface Props {
  userId: string;
  initialPosts: IEntry[];
}

const Entries = ({ initialPosts, userId }: Props) => {
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<IEntry[]>(initialPosts);
  const [scrollTrigger, isInView] = useInView();

  useEffect(() => {
    if (isInView) {
      handleFetchPosts();
    }
  }, [isInView, initialPosts]);

  const handleFetchPosts = async () => {
    setLoading(true);
    const result = await fetchPosts(page, 5);
    const newPosts = [...posts, ...result.posts];
    setPosts(newPosts);

    setPage(page + 1);
    setHasMore(result.isNext);
    setLoading(false);
  };

  return (
    <section className="flex flex-col gap-10">
      {posts.map((post: IEntry, index: number) => (
        <CSEntryCard
          key={post._id}
          id={post._id}
          queueId={post?.queueId}
          bomId={post?.bomId}
          currentUserId={userId}
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
          createdAt={post.createdAt.toString()}
          comments={JSON.parse(JSON.stringify(post.children))}
          likes={JSON.parse(JSON.stringify(post.likes))}
        />
      ))}
      {!hasMore && <div className="mt-10">You're up to date</div>}
      {loading && <div className="mt-10">Loading more entires...</div>}
      {hasMore && !loading && (
        <div className="mt-10" ref={scrollTrigger}>
          Load more entires...
        </div>
      )}
    </section>
  );
};

export default Entries;
