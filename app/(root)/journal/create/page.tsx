import PostJournal from "@/components/forms/PostJournal";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.user.onboarded) redirect("/onboarding");

  return (
    <>
      <PostJournal
        user={{
          id: userInfo.user.id,
          _id: userInfo.user._id,
          image: userInfo.user.image,
          name: userInfo.user.name,
          communities: JSON.parse(JSON.stringify(userInfo.user.communities)),
        }}
      />
    </>
  );
}

export default Page;
