"use client";

import { deleteEntry, likeEntry } from "@/lib/actions/journal.actions";
import { formatDateString } from "@/lib/utils";
import { timeDifferenceForDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "../EntryCard.css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { useEffect, useState } from "react";
import { IBomQueue } from "@/lib/types/bomQueue";
import BoMQueueCard from "../BoMQueueCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IBom } from "@/lib/types/bom";
import BoMCard from "../BoMCard";

interface Props {
  id: string;
  content: string;
  currentUserId: string;
  parentId?: string;
  author: {
    name: string;
    image: string;
    id: string;
    _id: string;
  };
  community: {
    _id?: string;
    id?: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
      name: string;
    };
  }[];
  likes: any;
  isComment?: boolean;
  queueId?: IBomQueue;
  bomId?: IBom;
}

const CSEntryCard = ({
  id,
  content,
  author,
  community,
  createdAt,
  comments,
  likes,
  isComment,
  queueId,
  bomId,
  currentUserId,
}: Props) => {
  const router = useRouter();

  const pathname = usePathname();

  const [stateLikes, setStateLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (!currentUserId || currentUserId.trim() === "") {
      router.push("/sign-in");
      return;
    }
    //Only run this function if the timeout is null
    setStateLikes((prev: any) => {
      return prev.find((l: any) => l.user === currentUserId)
        ? prev.filter((l: any) => l.user !== currentUserId)
        : [...prev, { user: currentUserId }];
    });

    await likeEntry(id, currentUserId, pathname);
  };

  const isEntryPage = pathname.includes("/journal/");

  const isOwner = author._id === currentUserId;
  const handleDelete = async () => {
    await deleteEntry(id, pathname);

    router.push(pathname);
  };

  const [isClient, setIsClient] = useState(false);

  const handleContentCheck = () => {
    //Ensure that the content uploaded is not an image. If it is an image exclude it from the count.

    //Check if content includes an image tag
    const imageTag = content.includes("<img");

    let cleanContent = content;
    //Check how many characters there are before the image tag
    if (imageTag) {
      cleanContent = content.replace(/<img[^>]*>/g, "");
    }
    const contentLength = cleanContent.length;

    if (contentLength < 400) {
      return true;
    }

    if (contentLength > 400) {
      return false;
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setIsLiked(stateLikes.find((l: any) => l.user == currentUserId));
  }, [stateLikes]);

  return (
    <article
      className={`group relative overflow-hidden flex w-full flex-col rounded-xl parent-text p-1  ${
        isComment ? "px-0 xs:px-7" : " bg-white dark:bg-dark-2 p-2"
      } `}
    >
      <div className="flex w-full flex-1 flex-row gap-4 p-4">
        <div className="flex w-full flex-col">
          <div className="flex flex-row gap-3 mb-3">
            <Link
              href={`/profile/${author.id}`}
              className="flex items-center rounded-full relative h-6 w-6 overflow-hidden cursor-pointer"
            >
              <Image
                src={author.image}
                alt="Profile image"
                width={96}
                height={96}
                className="cursor-pointer object-cover"
              />
            </Link>
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="!text-small-regular text-black dark:text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="meta-info !text-small-regular">
              {timeDifferenceForDate(new Date(createdAt))} ago
            </p>
            <div className="absolute right-10">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="hover:bg-gray-100 dark:hover:bg-dark-4 rounded-full p-2">
                    <Image
                      src={"/assets/menu-dots.svg"}
                      alt="Menu icon"
                      width={14}
                      height={14}
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDelete()}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div
            className={`${
              isComment && "mb-5"
            } mt-2 text-small-regular text-black dark:text-light-2 w-full text-wrap`}
          >
            {isClient && (
              <div
                dangerouslySetInnerHTML={{
                  __html: isEntryPage
                    ? content
                    : !isEntryPage && handleContentCheck()
                    ? content
                    : content.slice(0, 400) + "...",
                }}
              ></div>
            )}
            {queueId && (
              <BoMQueueCard
                queue={queueId}
                userId={currentUserId}
                isOwner={isOwner}
              />
            )}

            {bomId && (
              <BoMCard
                bom={bomId}
                handleView={() => {
                  console.log("what", bomId.startDate);
                }}
              />
            )}

            {content.length > 400 && !isEntryPage && !handleContentCheck() && (
              <Link href={`/journal/${id}`}>
                <p className="mt-1 cursor-pointer text-blue hover:underline">
                  Read More
                </p>
              </Link>
            )}
          </div>

          <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
            <div className="flex items-center gap-3.5">
              <div className="flex items-center gap-1">
                <Image
                  onClick={() => handleLike()}
                  src={`${
                    isLiked
                      ? "/assets/heart-filled.svg"
                      : "/assets/heart-gray.svg"
                  }`}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <p className="text-subtle-medium meta-info items-center">
                  {stateLikes.length}
                </p>
              </div>
              <Link href={`/journal/${id}`}>
                <Image
                  src="/assets/reply.svg"
                  alt="reply"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </Link>
            </div>

            {comments.length > 0 && (
              <div className="flex gap-2">
                <div className="flex relative ml-2.5">
                  {comments
                    .filter(
                      (obj, index, self) =>
                        index ===
                        self.findIndex((o) => o.author.name === obj.author.name)
                    )
                    .map((comment, index) => {
                      return (
                        index < 4 && (
                          <Image
                            key={index}
                            src={comment.author.image}
                            alt={`${comment.author.name} profile image`}
                            width={24}
                            height={24}
                            className="cursor-pointer object-contain -ml-2.5 bg-dark-2 rounded-full border-2 border-dark-2"
                          />
                        )
                      );
                    })}
                </div>

                <Link href={`/journal/${id}`}>
                  <p className="mt-1 text-subtle-medium text-black dark:text-white">
                    {comments.length} comments
                  </p>
                </Link>
              </div>
            )}
          </div>
          {!isComment && community && (
            <Link
              href={`/clubs/${community.id}`}
              className="mt-5 flex items-center"
            >
              <p className="text-subtle-medium text-gray-1">
                {formatDateString(createdAt)} - {community.name} Club
              </p>
              <div className="relative h-4 w-4">
                <Image
                  src={community.image}
                  alt={community.name}
                  fill
                  className="ml-2 rounded-full"
                />
              </div>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default CSEntryCard;
