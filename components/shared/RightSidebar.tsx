import { fetchCommunities } from "@/lib/actions/community.actions";
import CollapsableSidebar from "../custom-ui/CollapsableSidebar";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";

async function RightSidebar() {
  const user = await currentUser();

  const fetchUserResponse = user ? await fetchUser(user.id) : null;

  const commuminutyResult = await fetchCommunities({
    userId: fetchUserResponse?.user?._id,
    searchString: "",
    pageNumber: 1,
    pageSize: 5,
  });

  // const userResult = await fetchUsers({
  //   userId: "",
  //   searchString: "",
  //   pageNumber: 1,
  //   pageSize: 5,
  // });

  return (
    <CollapsableSidebar
      communities={JSON.parse(JSON.stringify(commuminutyResult.communities))}
      // users={JSON.parse(JSON.stringify(userResult.users))}
    />
  );
}

export default RightSidebar;
