"use server";

import { CommentInserType, FormState } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function getComments(postId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_detail_comments", {
      p_post_id: postId,
    })
    .order("created_at", { ascending: true });
  if (!error) {
    return data;
  } else return null;
}

export async function createComment(commentData: CommentInserType): Promise<[FormState, CommentInserType | null]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("comments").insert([commentData]).select().maybeSingle();

  if (error) {
    return [
      {
        success: false,
        error: `댓글 업로드 실패: ${error.message}`,
        result: null,
      },
      null,
    ];
  }

  return [{ success: true, error: null, result: null }, data];
}

export async function updateComment(commentId: string, content: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("comments").update({ content: content }).eq("id", commentId);

  if (error) {
    console.error(`댓글 수정 실패: ${error.message}`);
    return { success: false, error: error.message, result: null };
  }

  return { success: true, error: null, result: null };
}

export async function updateContent(prevState: FormState, formData: FormData): Promise<FormState> {
  const id = formData.get("id")?.toString() ?? "";
  const content = formData.get("content")?.toString() ?? "";

  if (!content.trim()) {
    return {
      success: false,
      error: "내용을 입력해주세요.",
      result: null,
    };
  }

  const state = await updateComment(id, content);

  if (!state?.success) return state;

  return {
    success: true,
    error: null,
    result: null,
  };
}
