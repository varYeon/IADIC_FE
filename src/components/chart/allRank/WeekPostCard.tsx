"use client";

import { useRouter } from "next/navigation";
import Badge from "@/components/common/Badge";
import BaseImage from "@/components/common/image/BaseImage";
import { categoryColor } from "@/utils/category";

export default function WeekPostCard({ post }: { post: WeekPostDataType }) {
  const router = useRouter();
  const image = post.post_image
    ? post.post_image
    : "https://eaftdwfkhrhvfqpahumo.supabase.co/storage/v1/object/public/user_upload_image/default_image.png";

  return (
    <div
      className="border-border-main col-span-1 w-full cursor-pointer rounded-lg border p-1 transition hover:scale-101"
      onClick={() => router.push(`/posts/${post.category_type}/post/${post.post_id}`)}
    >
      <BaseImage src={image} alt="post_img" className="h-[250px] max-h-[200px] w-full" />
      <div className="flex flex-col gap-1.5 p-2">
        <span className="text-text-title text-sm font-semibold">{post.title}</span>
        <span className="text-text-light text-xs font-semibold">{post.author_name}</span>
        <div className="flex justify-end">
          <Badge
            text={post.category_name}
            size={"sm"}
            className="text-bg-main font-semibold"
            style={{ backgroundColor: categoryColor[post.category_name] }}
          />
        </div>
      </div>
    </div>
  );
}
