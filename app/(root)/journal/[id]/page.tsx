import EntryCard from "@/components/cards/EntryCard";
import { fetchEntryById } from "@/lib/actions/journal.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";
import CSEntryCard from "@/components/cards/EntryCard/CSEntryCard";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.user.onboarded) redirect("/onboarding");

  const entry = await fetchEntryById(params.id);

  return (
    <section className="relative">
      <div>
        <CSEntryCard
          key={entry._id.toString()}
          id={entry._id.toString()}
          queueId={entry.queueId && JSON.parse(JSON.stringify(entry?.queueId))}
          currentUserId={userInfo?.user._id.toString() || ""}
          parentId={entry.parentId}
          content={entry.text}
          author={{
            name: entry.author.name,
            image: entry.author.image,
            id: entry.author.id,
            _id: entry.author._id.toString(),
          }}
          community={
            entry.community
              ? {
                  _id: entry.community._id.toString(),
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
      </div>
      <div className="mt-7">
        <Comment
          entryId={entry.id}
          currentUserImg={userInfo.user.image ? userInfo.user.image : ""}
          currentUserId={JSON.stringify(userInfo.user._id)}
        />
      </div>

      <div className="mt-10">
        {entry.children.map((comment: any) => (
          <EntryCard
            key={comment._id.toString()}
            id={comment._id.toString()}
            currentUserId={userInfo?.user._id.toString() || ""}
            parentId={comment.parentId}
            content={comment.text}
            author={{
              name: comment.author.name,
              image: comment.author.image,
              id: comment.author.id,
              _id: comment.author._id.toString(),
            }}
            community={
              comment.community
                ? {
                    _id: comment.community._id.toString(),
                    id: comment.community.id,
                    name: comment.community.name,
                    image: comment.community.image,
                  }
                : null
            }
            createdAt={comment.createdAt}
            comments={JSON.parse(JSON.stringify(comment.children))}
            likes={JSON.parse(JSON.stringify(comment.likes))}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
