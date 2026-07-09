"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { PostWithProfile } from "@/types/search";
import { categoryColor } from "@/utils/category";
import formatDate from "@/utils/formatDate";
import { cardVariants } from "./SearchResult";
import Badge from "../common/Badge";

export default function ResultPosts({
  searchData,
  textHighlight,
}: {
  searchData?: PostWithProfile[];
  textHighlight?: (text: string) => string | React.ReactElement[];
}) {
  const router = useRouter();
  const path = usePathname().split("/");
  const pathType = path[1];

  const handleClick = (id: string, category?: string) => {
    router.push(`/posts/${category}/post/${id}`);
  };

  if (!searchData || searchData.length === 0) return;

  return searchData?.map(post => (
    <div key={post.id} className={cardVariants()} onClick={() => handleClick(post.id, post.category?.type)}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex gap-2 text-xs">
          <p>{post.profiles?.name}</p>
          <p className="text-text-light">{formatDate(post.created_at)}</p>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <p className="font-bold">{textHighlight ? textHighlight(post.title) : post.title}</p>
          <p className="text-text-light">{textHighlight ? textHighlight(post.content ?? "") : (post.content ?? "")}</p>
        </div>
        <Badge
          size="sm"
          className="px-2 py-1 text-white"
          style={{ backgroundColor: categoryColor[post.category?.name ?? "#999999"] }}
          text={post.category?.name ?? "전체"}
        />
      </div>
      <div>
        {post.post_image && (
          <Image
            src={post.post_image}
            alt={`${post.title}의 썸네일`}
            width={192}
            height={192}
            className="m-1.5 h-48 min-h-48 w-48 min-w-48 rounded-sm"
          />
        )}
      </div>
    </div>
    // </ResponsiveContainer>
  ));
}
