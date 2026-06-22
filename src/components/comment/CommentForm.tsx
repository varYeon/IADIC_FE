"use client";

import { useActionState, useEffect } from "react";
import { FormState } from "@/types";
import Toast from "../common/toast/Toast";

export default function CommentForm({
  action,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    error: null,
    result: null,
  });

  useEffect(() => {
    if (state.error) {
      Toast({ message: state.error, type: "ERROR" });
    }
    if (state.result) {
      state.result.forEach(res => {
        Toast({ message: `${res.badgeName} 뱃지를 획득하셨습니다!`, type: "SUCCESS" });
        if (res.leveledUp) Toast({ message: `${res.newLevel} 레벨업!`, type: "SUCCESS" });
      });
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="comment-input-container bg-bg-main mt-5 flex items-center rounded-lg px-5 py-4"
    >
      <input
        type="text"
        name="content"
        className="bg-bg-sub mr-3 h-7 flex-3/4 rounded-sm px-2 py-1 text-sm outline-0"
      />
      <button type="submit" className="bg-main cursor-pointer rounded-sm px-3 py-1.5 text-xs text-white">
        {isPending ? "전송중..." : "보내기"}
      </button>
    </form>
  );
}
