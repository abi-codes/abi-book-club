import Entries from "@/components/sections/entries";

import { fetchPosts } from "@/lib/actions/journal.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { Suspense } from "react";

async function Page() {
  const result = await fetchPosts(1, 5);

  const user = await currentUser();

  let userInfo: any = null;

  if (user) userInfo = await fetchUser(user?.id);

  return (
    <section>
      <Suspense fallback={<div>Loading journal entries...</div>}>
        <Entries
          initialPosts={result.posts}
          userId={userInfo?.user?._id.toString() || ""}
        />
      </Suspense>
    </section>
  );
}

export default Page;
