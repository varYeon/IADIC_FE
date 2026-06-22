"use client";

import { Grid2x2, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Divider } from "@/components/common/Divider";

export type PostFilterType = "all" | "following";

export default function PostSideButton({
  isLogin,
  onChangeFilter,
}: {
  isLogin: boolean;
  onChangeFilter?: (filter: PostFilterType) => void;
}) {
  const [filter, setFilter] = useState<PostFilterType>("all");

  const handleFilterChange = (type: PostFilterType) => {
    setFilter(type);
    onChangeFilter?.(type);
  };

  return (
    <>
      {isLogin && (
        <>
          <Link href="/posts/write?page=new" className="w-[98%]">
            <Button size="md" className="w-full">
              <Plus size={24} />
              <span>글쓰기</span>
            </Button>
          </Link>
          <Divider width="95" className="bg-border-main" />
          <div className="post-filter-btn flex w-full items-center justify-center gap-1">
            <Button
              size="sm"
              className={`w-22`}
              variant={filter === "all" ? "primary" : "tertiary"}
              onClick={() => handleFilterChange("all")}
            >
              <Grid2x2 size={12} className="mr-2" />
              <span>전체보기</span>
            </Button>

            <Button
              size="sm"
              className={`w-42`}
              variant={filter === "following" ? "primary" : "tertiary"}
              onClick={() => handleFilterChange("following")}
            >
              <Users size={12} className="mr-2" />
              <span>내가 팔로우한 사용자</span>
            </Button>
          </div>
        </>
      )}
    </>
  );
}
