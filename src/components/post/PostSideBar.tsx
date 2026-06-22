"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import PostSideButton from "./PostSideButton";
import type { PostFilterType } from "./PostSideButton";
import PostSideList from "./PostSideList";

export interface postCardSampleDataType {
  id: string;
  createdAt: string;
  name: string;
  title: string;
  categoryName: string;
  categoryType: string;
}

export default function PostSideBar({ userId }: { userId: string | undefined }) {
  const currentPath = usePathname().split("/");
  const isPostDetail = currentPath.length > 3;
  const [filter, setFilter] = useState<PostFilterType>("all");
  const isSelectedUser = !!useSearchParams().get("user");

  return (
    <div
      className={twMerge(
        "category-side flex max-h-screen min-w-[270px] flex-col items-center gap-2 max-sm:w-full max-sm:px-6 max-sm:pb-6",
        isPostDetail && "max-[1100px]:hidden",
        isSelectedUser && "max-xl:hidden"
      )}
    >
      <PostSideButton isLogin={!!userId} onChangeFilter={f => setFilter(f)} />
      {filter === "all" && <PostSideList />}
      {filter === "following" && <PostSideList user_id={userId} />}
    </div>
  );
}
