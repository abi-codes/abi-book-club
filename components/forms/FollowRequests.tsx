import { IFollowUser } from "@/lib/types/user";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { fetchUserFollowRequests } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

interface Props {
  _userId: string;
}

const FollowRequests = ({ _userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [requestList, setRequestList] = useState<IFollowUser[]>([]);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    fetchUserFollowRequests({
      userId: _userId,
      pageNumber: currentPage,
    })
      .then((response) => {
        setRequestList(response.users);
        setTotalPages(response.totalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user request list", error);
      });
  }, [currentPage]);

  return (
    <section
      className="flex max-sm:flex-col gap-10 border border-solid
   border-gray-300-400 rounded-xl p-5 shadow-sm"
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-heading3-bold">Pending requests</h1>
      </div>

      <div className="flex flex-col flex-1 gap-6">
        <div className="flex flex-col gap-12">
          {/* Loop through books here */}
          {!isLoading &&
            requestList &&
            requestList.length > 0 &&
            requestList.map((user) => (
              <article className="user-card">
                <div className="user-card_avatar">
                  <div className="relative h-12 w-12">
                    <img
                      src={user.image}
                      alt="user_logo"
                      className="rounded-full object-cover"
                    />
                  </div>

                  <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-black dark:text-light-1">
                      {user.name} {user.surname}
                    </h4>
                    <p className="text-small-medium text-gray-1">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <Button
                  className="user-card_btn"
                  onClick={() => {
                    router.push(`/profile/${user.id}`);
                  }}
                >
                  View
                </Button>
                <Button
                  className="user-card_btn"
                  variant="destructive"
                  //   onClick={() => rejectMemeberRequest()}
                >
                  Reject
                </Button>
                <Button
                  className="user-card_btn bg-green-800"
                  //   onClick={() => approveMemberRequest()}
                >
                  Accept
                </Button>
                {/* {personType === "Member" && (
                  <Button className="user-card_btn" variant="destructive">
                    Ban
                  </Button>
                )}

                {personType === "Request" && (
                  <>
                    <Button
                      className="user-card_btn"
                      variant="destructive"
                      onClick={() => rejectMemeberRequest()}
                    >
                      Reject
                    </Button>
                    <Button
                      className="user-card_btn bg-green-800"
                      onClick={() => approveMemberRequest()}
                    >
                      Accept
                    </Button>
                  </>
                )} */}
              </article>
            ))}
        </div>
        {isLoading && <p>Loading...</p>}
        {!isLoading && requestList.length === 0 && (
          <p>No pending requests or members </p>
        )}
        {requestList.length !== 0 && (
          <div className="flex items-center justify-between">
            <div className="max-sm:hidden"></div>
            <div className="flex items-center gap-7">
              <Button
                className="cursor-pointer"
                disabled={currentPage - 1 <= 0}
                onClick={() => setPage(currentPage - 1)}
              >
                {"<"}
              </Button>
              <p>
                {currentPage} of {totalPages} page(s)
              </p>
              <Button
                className="cursor-pointer"
                disabled={currentPage == totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                {">"}
              </Button>
            </div>
            <div className="flex gap-3">
              {/* //Create a loop to loop over the number of pages */}
              {pages.map(
                (page, i) =>
                  i < 3 && (
                    <Button
                      key={page}
                      className={`${
                        currentPage === page
                          ? "bg-red-800 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                      onClick={() => setPage(page)}
                    >
                      {page}
                    </Button>
                  )
              )}

              {totalPages > 3 && (
                <div className="flex gap-2">
                  <span>...</span>
                  <Button className="bg-gray-200 text-black">
                    {totalPages}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FollowRequests;
