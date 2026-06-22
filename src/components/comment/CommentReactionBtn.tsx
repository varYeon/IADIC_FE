"use client";

import { cva, VariantProps } from "class-variance-authority";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  addReaction,
  adoptComment,
  deleteReaction,
  hasAdoptedComment,
  selectReaction,
} from "@/services/comment/comment.client";
import { badgeAdopt, badgeLikesGiven, badgeLikesReceived } from "@/utils/achieve/client";
import Toast from "../common/toast/Toast";

const buttonVariants = cva(
  `flex items-center justify-center rounded-xs bg-gray-300 p-0.5 text-gray-500 cursor-pointer`,
  {
    variants: {
      buttonType: {
        like: "bg-main text-white",
        disLike: "bg-rose-600 text-white",
        adopt: "bg-emerald-600 text-white",
      },
    },
  }
);

const hasReactionVariants = cva(
  `flex items-center justify-center rounded-xs bg-gray-300  p-0.5 text-gray-700 cursor-pointer transition-all`,
  {
    variants: {
      buttonType: {
        like: "hover:bg-main/50 hover:text-white",
        disLike: "hover:bg-rose-600/50 hover:text-white",
        adopt: "hover:bg-emerald-600/50 hover:text-white",
      },
    },
  }
);

const textVariants = cva(`text-text-main`, {
  variants: {
    buttonType: {
      like: "text-main",
      disLike: "text-rose-600",
      adopt: "text-emerald-600",
    },
  },
});

interface CommentReactionBtnProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  isLogin: boolean;
  userId: string;
  isMyPost?: boolean;
  isAdopted?: boolean;
  currentUserId: string;
  commentId: string;
  postId?: string;
  categoryId: string;
  reactions?: { count: number };
  className?: string;
}

export default function CommentReactionBtn({
  isLogin,
  userId,
  isMyPost,
  isAdopted,
  currentUserId,
  postId,
  commentId,
  categoryId,
  children,
  buttonType,
  reactions,
  className,
  ...props
}: CommentReactionBtnProps) {
  const [count, setCount] = useState(reactions?.count ?? 0);
  const [isActive, setIsActive] = useState(!!reactions);
  const [adoptedState, setAdoptedState] = useState(isAdopted);

  const isMine = currentUserId === userId;

  useEffect(() => {
    setIsActive(count > 0);
  }, [count]);

  const handleAdopt = async () => {
    if (!isLogin) {
      Toast({ message: "로그인이 필요한 기능입니다.", type: "ERROR" });
      return;
    }

    if (!isMyPost) {
      Toast({ message: "자신이 올린 게시물의 훈수만 채택할 수 있습니다.", type: "ERROR" });
      return;
    }

    if (isMine) {
      Toast({ message: "자신의 훈수는 채택할 수 없습니다.", type: "ERROR" });

      return;
    }

    const { data } = await hasAdoptedComment(postId ?? "");

    if (!data?.adopted_comment_id) {
      setAdoptedState(true);
      const { error } = await adoptComment(postId ?? "", commentId);

      if (error) {
        console.error(`댓글 채택 에러: `, error.message);
        setAdoptedState(false);
        return;
      }
      await badgeAdopt(userId, categoryId);
    } else {
      if (data?.adopted_comment_id !== commentId) {
        Toast({ message: "이미 채택한 훈수가 있습니다.", type: "ERROR" });
        return;
      }

      if (adoptedState) {
        setAdoptedState(false);
        const { error } = await adoptComment(postId ?? "", null);

        if (error) {
          console.error(`댓글 채택 취소 에러: `, error.message);
          setAdoptedState(true);
          return;
        }
      }
    }
  };

  const handleReaction = async (type: string) => {
    if (!isLogin) {
      Toast({ message: "로그인이 필요한 기능입니다.", type: "ERROR" });
      return;
    }
    if (isMine) {
      Toast({ message: "자신의 댓글에는 반응을 남길 수 없습니다.", type: "ERROR" });
      return;
    }

    const { data, error } = await selectReaction(currentUserId, commentId);

    if (error) {
      console.error(`댓글 ${type} 조회 에러: ` + error.message);
      return;
    }

    // 반응 없을 경우 추가
    if (data?.length === 0) {
      setCount(prev => prev + 1);

      const { error } = await addReaction(type, currentUserId, commentId);

      if (error) {
        console.error(`댓글 ${type} 추가 에러: ` + error.message);
        setCount(prev => prev - 1);
        return;
      }

      if (type === "like") {
        const result = await badgeLikesGiven(currentUserId);
        await badgeLikesReceived(userId);

        result?.forEach(res => {
          Toast({ message: `${res.badgeName} 뱃지를 획득하셨습니다!`, type: "SUCCESS" });
          if (res.leveledUp) Toast({ message: `${res.newLevel} 레벨업!`, type: "SUCCESS" });
        });
      }
    } else {
      // 반응 있을 경우
      if (data[0].type !== type) {
        Toast({ message: "좋아요 또는 싫어요 중 하나의 반응만 추가할 수 있습니다.", type: "ERROR" });
        return;
      }
      setCount(prev => prev - 1);

      const { error } = await deleteReaction(currentUserId, commentId);

      if (error) {
        console.error(`댓글 ${type} 제거 에러: ` + error.message);
        setCount(prev => prev - 1);
        return;
      } else {
      }
    }
  };
  return (
    <div className="flex">
      <button
        onClick={() => {
          if (buttonType === "like" || buttonType === "disLike") handleReaction(buttonType);
          else if (buttonType === "adopt") handleAdopt();
        }}
        className={twMerge(
          hasReactionVariants({ buttonType }),
          isActive || isAdopted ? buttonVariants({ buttonType }) : "",
          adoptedState ? buttonVariants({ buttonType }) : "",
          className
        )}
        {...props}
      >
        {children}
      </button>
      <span
        className={twMerge(
          "ml-1 text-[8px]",
          textVariants(),
          isActive || buttonType === "adopt" ? textVariants({ buttonType }) : ""
        )}
      >
        {buttonType === "adopt" && adoptedState ? "채택" : isActive && `${count}`}
      </span>
    </div>
  );
}
