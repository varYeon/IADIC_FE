"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CommentDetailType, FormState, PostDetailType } from "@/types";
import { User } from "@supabase/supabase-js";
import PostCard from "./PostCard";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import ResponsiveContainer from "../common/ResponsiveContainer";
import ProfileSlide from "../user/ProfileSlide";

export default function PostDetail({
  user,
  commentData,
  postData,
  postId,
  writeComment,
  userBadgeData,
}: {
  user: User | null;
  commentData: CommentDetailType[];
  postData: PostDetailType | null;
  postId: string;
  writeComment: (prevState: FormState, formData: FormData) => Promise<FormState>;
  userBadgeData: userBadgeType;
}) {
  const router = useRouter();
  const path = usePathname();
  const isMyPost = user ? postData?.user_id === user.id : false;
  const [selectedUser, setSelectedUser] = useState(false);

  const handleSelectUser = () => {
    setSelectedUser(true);
  };

  return (
    <>
      <ResponsiveContainer
        className={`bg-bg-sub scrollbar-hide flex w-full flex-col overflow-scroll max-sm:border-none ${selectedUser && "max-lg:hidden"}`}
      >
        <PostCard
          userId={user?.id ?? ""}
          commentCount={commentData?.length ?? 0}
          postData={postData}
          handleSelectUser={handleSelectUser}
          userBadgeData={userBadgeData}
          className="bg-bg-main rounded-t-none border-t-0 border-r-0 border-l-0"
        />
        <div className="flex h-full flex-col justify-between px-6 py-5">
          <CommentList
            isLogin={!!user}
            isMyPost={isMyPost}
            userId={user?.id ?? ""}
            postId={postId}
            categoryId={postData?.category_id ?? ""}
            commentData={commentData ?? []}
            adoptedCommentId={postData?.adopted_comment_id ?? ""}
          />
          <CommentForm action={writeComment} />
        </div>
      </ResponsiveContainer>
      {selectedUser && (
        <div className="w-full lg:w-1/3">
          <ProfileSlide
            onClick={() => {
              setSelectedUser(false);
              router.replace(`${path}`);
            }}
          />
        </div>
      )}
    </>
  );
}
