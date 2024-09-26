import { fetchBooks } from "@/lib/actions/book.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Books from "@/components/sections/books";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.user.onboarded) redirect("/onboarding");

  // Fetch books
  const result = await fetchBooks(1, 15);

  return (
    <section>
      <div className="flex justify-between align-middle">
        <h1 className="head-text text-dark-2 dark:text-light-2">Abi's Books</h1>
      </div>
      {/* Search Bar*/}
      <Books initialBooks={result.books} />
    </section>
  );
}

export default Page;
