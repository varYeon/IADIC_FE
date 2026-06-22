"use client";

import { cva, VariantProps } from "class-variance-authority";
import { Bookmark, ChevronLeft, MessageSquareMore } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { getBookmarkCount } from "@/services/post/bookmark";
import { deletePost } from "@/services/post/post.client";
import { deleteFollow, insertFollow } from "@/services/profile/updateFollow";
import { PostDetailType } from "@/types";
import { categoryColor } from "@/utils/category";
import { createClient } from "@/utils/supabase/client";
import PostCardBookMark from "./PostCardBookMark";
import Badge from "../common/Badge";
import BaseImage from "../common/image/BaseImage";
import Toast from "../common/toast/Toast";

const thumbnailVariants = cva(
  "post-card_post-thumbnail relative overflow-hidden object-cover rounded-xl border border-border-main",
  {
    variants: {
      device: {
        pc: "h-75",
        mobile: "h-[113px]",
      },
    },
    defaultVariants: {
      device: "pc",
    },
  }
);

interface PostCardProps extends VariantProps<typeof thumbnailVariants> {
  userId: string;
  postData: PostDetailType | null;
  commentCount: number;
  handleSelectUser: () => void;
  userBadgeData: userBadgeType;
  className?: string;
}

export default function PostCard({
  userId,
  device,
  postData,
  commentCount,
  handleSelectUser,
  userBadgeData,
  className,
}: PostCardProps) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [followList, setFollowList] = useState<string[]>();
  const isMyPost = userId === postData?.user_id;

  const handleBookmarkCount = (count: number) => {
    setBookmarkCount(prev => prev + count);
  };

  useEffect(() => {
    const supabase = createClient();
    const fetchData = async () => {
      if (userId) {
        const { data: followList } = await supabase.from("follow").select("following_id").eq("follower_id", userId);
        const followListData = followList?.map(f => f.following_id) ?? [];
        setFollowList(followListData);
      }
    };
    const loadBookmarkCount = async () => {
      const count = await getBookmarkCount(postData?.id ?? "");
      setBookmarkCount(count ?? 0);
    };
    fetchData();
    loadBookmarkCount();
  }, [postData?.id, userId]);

  const handleFollow = async () => {
    if (userId && postData?.user_id && (followList ?? []).includes(postData?.user_id)) {
      const { success, error } = await deleteFollow(userId, postData?.user_id);
      if (error) {
        Toast({ message: error, type: "ERROR" });
      } else if (success && !error) {
        setFollowList(prev => prev?.filter(id => id !== postData?.user_id));
        Toast({ message: postData?.profiles.name + "님을 언팔로우 했습니다.", type: "SUCCESS" });
      }
    } else if (userId && postData?.user_id) {
      const { success, error } = await insertFollow(userId, postData?.user_id);
      if (error) {
        Toast({ message: error, type: "ERROR" });
      } else if (success && !error) {
        setFollowList(prev => [...(prev ?? []), postData?.user_id]);
        Toast({ message: postData?.profiles.name + "님을 팔로우 했습니다.", type: "SUCCESS" });
      }
    }
  };

  if (postData) {
    const { content, post_image, profiles, title } = postData;
    return (
      <>
        <div
          className={twMerge(
            "post-card border-border-main flex flex-col rounded-3xl border px-6 py-5 break-all",
            className
          )}
        >
          <div className="post-card_user mb-5 flex items-center justify-between">
            <div className="post-card_user-info text-text-title flex items-center">
              <button
                onClick={() => {
                  router.back();
                }}
                className="hover:text-main mr-5 cursor-pointer min-[1100px]:hidden"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => {
                  handleSelectUser();
                  const next = new URLSearchParams();
                  next.set("user", profiles.id);
                  router.push(`${currentPath}?${next.toString()}`);
                }}
                className="cursor-pointer"
              >
                <Image
                  src={profiles.avatar_image ?? "/profile_sample.svg"}
                  alt="user profile image"
                  width={32}
                  height={32}
                  className="border-border-main rounded-sm border"
                />
              </button>

              <span className="mr-2 ml-5 text-xs">{profiles.name}</span>
              {userBadgeData?.badge?.name && (
                <Badge
                  size="sm"
                  text={userBadgeData?.badge?.name}
                  style={
                    userBadgeData?.badge?.type === "category"
                      ? {
                          backgroundColor: categoryColor[userBadgeData.badge.category?.name ?? ""],
                        }
                      : { backgroundColor: "#999999" }
                  }
                  className="text-white"
                />
              )}
            </div>
            {!isMyPost && userId && (
              <div className="flex gap-2">
                <button
                  className={
                    (followList ?? []).includes(postData?.user_id)
                      ? "hover:bg-main/10 hidden h-max cursor-pointer items-center justify-center rounded-lg p-2"
                      : "bg-main hover:bg-main/80 hidden h-max cursor-pointer items-center justify-center rounded-lg p-2 text-white"
                  }
                  onClick={() => handleFollow()}
                >
                  <span
                    className={
                      (followList ?? []).includes(postData?.user_id) ? "text-main text-xs" : "text-xs text-white"
                    }
                  >
                    {(followList ?? []).includes(postData?.user_id) ? "팔로잉" : "팔로우"}
                  </span>
                </button>
                <PostCardBookMark postId={postData.id} userId={userId} handleBookmarkCount={handleBookmarkCount} />
              </div>
            )}
          </div>
          <div className="post-card_detail flex flex-col gap-3">
            <p className="post-card_post-title text-text-title text-base font-bold">{title}</p>
            <p className="post-card_post-content text-text-sub text-sm whitespace-pre-wrap">{content}</p>
            {post_image && (
              <div className={thumbnailVariants({ device })} onClick={() => setIsOpen(true)}>
                <BaseImage
                  src={post_image}
                  alt="post thumbnail image"
                  className="h-full w-full cursor-pointer object-fill"
                />
              </div>
            )}
            <div className="post-card_btns text-text-sub flex justify-between gap-6">
              <div className="flex gap-6">
                <div className="post-card_comment flex items-center justify-center">
                  <MessageSquareMore size={12} />
                  <span className="ml-2 text-xs">{commentCount}</span>
                </div>
                <div className="post-card_share flex items-center justify-center">
                  <Bookmark size={12} />
                  <span className="ml-2 text-xs">{bookmarkCount}</span>
                </div>
              </div>
              {isMyPost && (
                <div className="text-text-light flex gap-1 text-xs">
                  <Link href={`/posts/write?page=edit&id=${postData.id}`} className="hover:text-main cursor-pointer">
                    수정
                  </Link>
                  <span>|</span>
                  <button
                    className="hover:text-main cursor-pointer"
                    onClick={async () => {
                      const ok = confirm("정말 삭제하시겠습니까?");
                      if (!ok) return;
                      await deletePost(postData.id, post_image ?? "");
                      redirect("/posts");
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
          {isOpen && (
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-bg-main relative rounded-2xl"
                    onClick={e => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <img
                      src={post_image ?? ""}
                      alt="원본 이미지"
                      className="rounded-lg shadow-xl"
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "90vw",
                        maxHeight: "90vh",
                        display: "block",
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </>
    );
  }
}
