"use client";

import { cva } from "class-variance-authority";
import { Stamp, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { deleteComment } from "@/services/comment/comment.client";
import { CommentDetailType } from "@/types";
import { categoryColor } from "@/utils/category";
import formatDate from "@/utils/formatDate";
import { CommentModifyForm } from "./CommentModifyForm";
import CommentReactionBtn from "./CommentReactionBtn";
import Badge from "../common/Badge";
import CircleProfileImage from "../common/image/CircleProfileImage";

const BubbleVariants = cva("flex items-end gap-2 w-full ", {
  variants: {
    isMine: {
      true: "justify-end",
      false: "justify-start",
    },
  },
  defaultVariants: {
    isMine: false,
  },
});

const TextVariants = cva("max-w-[45%] px-3 py-2 rounded-xl text-sm break-all", {
  variants: {
    isMine: {
      true: "bg-main text-white rounded-tr-none",
      false: "bg-bg-main  text-text-content rounded-tl-none",
    },
  },
  defaultVariants: {
    isMine: false,
  },
});

export default function MessageBubble({
  isLogin,
  isMyPost,
  data,
  postId,
  currentUserId,
  adoptedId,
  categoryId,
}: {
  isLogin: boolean;
  isMyPost: boolean;
  data: CommentDetailType;
  postId: string;
  currentUserId: string;
  adoptedId: string;
  categoryId: string;
}) {
  const { content, created_at, id, reactions, user_id, profiles } = data;
  const isAdopted = id === adoptedId;
  const isMine = currentUserId === user_id;

  const [isUpdate, setIsUpdate] = useState(false);
  const handleUpdate = () => {
    setIsUpdate(false);
  };

  return (
    <div className={BubbleVariants({ isMine })}>
      {isMine ? (
        <div className="flex w-full flex-col gap-1">
          {isUpdate ? (
            <CommentModifyForm handleUpdate={handleUpdate} id={id} content={content} />
          ) : (
            <div className="flex items-end justify-end gap-2">
              <div className="flex flex-col items-end">
                <div className="text-text-light flex gap-1 text-[9px]">
                  <button
                    onClick={() => {
                      setIsUpdate(prev => !prev);
                    }}
                    className="hover:text-main cursor-pointer"
                  >
                    수정
                  </button>
                  <span>|</span>
                  <button
                    className="hover:text-main cursor-pointer"
                    onClick={async () => {
                      await deleteComment(currentUserId, id);
                    }}
                  >
                    삭제
                  </button>
                </div>

                <span className="text-text-sub cursor-default text-[9px]">{formatDate(created_at)}</span>
              </div>

              <div className={TextVariants({ isMine })}>
                <p className="whitespace-pre-wrap">{content}</p>
              </div>
            </div>
          )}
          <div className="comment-btns flex justify-end gap-2">
            <CommentReactionBtn
              isLogin={isLogin}
              userId={user_id}
              currentUserId={currentUserId}
              commentId={id}
              categoryId={categoryId}
              buttonType="like"
              reactions={reactions.like}
            >
              <ThumbsUp size={8} />
            </CommentReactionBtn>
            <CommentReactionBtn
              isLogin={isLogin}
              userId={user_id}
              currentUserId={currentUserId}
              commentId={id}
              categoryId={categoryId}
              buttonType="disLike"
              reactions={reactions.disLike}
            >
              <ThumbsDown size={8} />
            </CommentReactionBtn>
            {isAdopted && (
              <CommentReactionBtn
                isLogin={isLogin}
                userId={user_id}
                isMyPost={isMyPost}
                isAdopted={isAdopted}
                currentUserId={currentUserId}
                commentId={id}
                categoryId={categoryId}
                buttonType="adopt"
              >
                <Stamp size={8} />
              </CommentReactionBtn>
            )}
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center justify-start gap-1.5">
            <CircleProfileImage
              src={profiles.avatar_image ?? "/profile_sample.svg"}
              alt="comment user profile image"
              className="h-9 w-9"
            />{" "}
            <div className="flex flex-col justify-center gap-0.5">
              <span className="text-sm">{profiles.name}</span>
              <div className="flex gap-1">
                <Badge text={`LV.${profiles.level}`} size="xs" className="bg-main px-1 py-0.5 text-white" />
                {profiles.badge.name && (
                  <Badge
                    text={profiles.badge.name}
                    size="xs"
                    className="px-1 py-0.5"
                    style={{ backgroundColor: categoryColor[profiles.badge.category.name] ?? "#999999", color: "#fff" }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <div className={TextVariants({ isMine })}>
              <p className="whitespace-pre-wrap">{content}</p>
            </div>
            <span className="text-text-sub text-[9px]">{formatDate(created_at)}</span>
          </div>
          <div className="comment-btns flex gap-2 pl-1.5">
            <CommentReactionBtn
              isLogin={isLogin}
              userId={user_id}
              currentUserId={currentUserId}
              commentId={id}
              categoryId={categoryId}
              buttonType="like"
              reactions={reactions.like}
            >
              <ThumbsUp size={8} />
            </CommentReactionBtn>
            <CommentReactionBtn
              isLogin={isLogin}
              userId={user_id}
              currentUserId={currentUserId}
              commentId={id}
              categoryId={categoryId}
              buttonType="disLike"
              reactions={reactions.disLike}
            >
              <ThumbsDown size={8} />
            </CommentReactionBtn>
            {isAdopted ? (
              <CommentReactionBtn
                isLogin={isLogin}
                userId={user_id}
                isMyPost={isMyPost}
                isAdopted={isAdopted}
                currentUserId={currentUserId}
                postId={postId}
                commentId={id}
                categoryId={categoryId}
                buttonType="adopt"
              >
                <Stamp size={8} />
              </CommentReactionBtn>
            ) : (
              isMyPost && (
                <CommentReactionBtn
                  isLogin={isLogin}
                  userId={user_id}
                  isMyPost={isMyPost}
                  isAdopted={isAdopted}
                  currentUserId={currentUserId}
                  postId={postId}
                  commentId={id}
                  categoryId={categoryId}
                  buttonType="adopt"
                >
                  <Stamp size={8} />
                </CommentReactionBtn>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
