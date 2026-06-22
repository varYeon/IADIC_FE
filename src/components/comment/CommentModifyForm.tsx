"use client";

import { useActionState, useEffect } from "react";
import { updateContent } from "@/services/comment/comment.server";

export function CommentModifyForm({
  handleUpdate,
  id,
  content,
}: {
  handleUpdate: () => void;
  id: string;
  content: string;
}) {
  const [state, formAction, isPending] = useActionState(updateContent, {
    success: false,
    error: null,
    result: null,
  });

  useEffect(() => {
    if (state.error) {
      alert(state.error);
    }
    if (state.success) {
      handleUpdate();
    }
  }, [state]);

  return (
    <form action={formAction} className="flex items-end justify-end gap-2">
      <div className="flex flex-col items-end">
        <div className="text-text-light flex gap-0.5 text-[9px]">
          <button type="submit" className="hover:text-main cursor-pointer">
            {isPending ? "수정중..." : "수정 완료"}
          </button>
          <span>|</span>
          <button
            onClick={() => {
              handleUpdate();
            }}
            className="hover:text-main cursor-pointer"
          >
            취소
          </button>
        </div>
      </div>

      <div className="bg-main max-w-[45%] rounded-2xl rounded-tr-none px-3 py-2 text-sm text-white">
        <input type="hidden" name="id" value={id} />
        <input defaultValue={content} name="content" className="outline-0" />
      </div>
    </form>
  );
}
