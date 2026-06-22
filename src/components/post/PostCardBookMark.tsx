"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { addBookmark, deleteBookmark, isBookmarked } from "@/services/post/bookmark";

export default function PostCardBookMark({
  postId,
  userId,
  handleBookmarkCount,
}: {
  postId: string;
  userId: string;
  handleBookmarkCount: (count: number) => void;
}) {
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);

  useEffect(() => {
    if (userId) {
      const getBookmarkState = async (postId: string) => {
        const isBookmarkedState = await isBookmarked(postId, userId);
        setIsBookmarkedState(isBookmarkedState ?? false);
      };

      getBookmarkState(postId);
    }
  }, []);

  const handleBookmark = async (isBookmarked: boolean) => {
    if (userId) {
      if (isBookmarked) {
        const { success } = await deleteBookmark(postId, userId);
        handleBookmarkCount(-1);
        setIsBookmarkedState(false);
        if (!success) {
          handleBookmarkCount(+1);
          setIsBookmarkedState(true);
        }
      } else {
        const { success } = await addBookmark(postId, userId);
        handleBookmarkCount(1);
        setIsBookmarkedState(true);
        if (!success) {
          handleBookmarkCount(-1);
          setIsBookmarkedState(false);
        }
      }
    }
  };

  return (
    <>
      <button className="cursor-pointer" onClick={() => handleBookmark(isBookmarkedState)}>
        <Bookmark size={18} className={twMerge("text-main hover:fill-main/30", isBookmarkedState && "fill-main")} />
      </button>
    </>
  );
}
