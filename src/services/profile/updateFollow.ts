"use client";

import { createClient } from "@/utils/supabase/client";

export async function deleteFollow(followerId: string, followingId: string) {
  const supabase = createClient();
  const { error: deleteErrors } = await supabase
    .from("follow")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);
  if (deleteErrors) {
    console.log(deleteErrors);
    return {
      success: false,
      error: "팔로우 취소 중에 문제가 발생하였습니다.",
    };
  }
  return { success: true, error: null, result: null };
}

export async function insertFollow(followerId: string, followingId: string) {
  const supabase = createClient();
  const { error: insertErrors } = await supabase
    .from("follow")
    .insert({ follower_id: followerId, following_id: followingId });
  if (insertErrors) {
    console.log(insertErrors);
    return {
      success: false,
      error: "팔로우 중에 문제가 발생하였습니다.",
    };
  }
  return { success: true, error: null, result: null };
}
