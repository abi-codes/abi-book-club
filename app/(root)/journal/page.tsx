import Entries from "@/components/sections/entries";
import { fetchPosts } from "@/lib/actions/journal.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const result = await fetchPosts(1, 5);
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

      <section>
        <Suspense fallback={<div>Loading journal entries...</div>}>
          <Entries
            initialPosts={result.posts}
            userId={userInfo?.user?._id.toString() || ""}
          />
        </Suspense>
      </section>
    </>
  );
}
