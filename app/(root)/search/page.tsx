import UserSearch from "@/components/custom-ui/UserSearch";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.user.onboarded) redirect("/onboarding");

  return (
    <section>
      <h1 className="head-text text-black dark:text-white leading-none mb-1">
        Search For
        <br />
        Your Favorite
      </h1>
      <h1 className="head-text cursive">Creators</h1>
      <img
        src="\assets\underline.png"
        alt="Text Underline"
        width="150px"
        height="10px"
        className="underline"
      ></img>
      {/* Search Bar*/}
      <div className="w-full mt-5">
        <UserSearch userId={user.id} />
      </div>
    </section>
  );
}

export default Page;
