import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user?.id);
  if (userInfo.user && userInfo.user.onboarded) redirect("/");

  const userData = {
    id: user?.id,
    objectId: userInfo?.user?._id,
    email: userInfo?.user
      ? userInfo?.user.email
      : user?.emailAddresses[0].emailAddress || "",
    username: userInfo.user ? userInfo?.user.username : user?.username || "",
    name: userInfo.user ? userInfo?.user.name : user?.firstName || "",
    surname: userInfo.user ? userInfo?.user.surname : "",
    bio: userInfo.user ? userInfo?.user.bio : "",
    image: userInfo.user ? userInfo?.user.image : user?.imageUrl,
    occupation: userInfo.user ? userInfo?.user.occupation : "",
  };
  return (
    <main className="w-full bg-white dark:bg-dark-2">
      <div className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20 ">
        <h1 className="head-text text-black dark:text-light-2">Onboarding</h1>
        <p className="mt-3 text-base-regular text-black dark:text-light-2 ">
          Complete your profile now to use Abi's Book Club
        </p>
        <section className="mt-9 bg-gray-100 rounded-md dark:bg-dark-2 p-10">
          <AccountProfile user={userData} btnTitle="Continue" />
        </section>
      </div>
    </main>
  );
}

export default Page;
