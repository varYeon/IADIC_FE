"use client";

import Toast from "@/components/common/toast/Toast";
import { FollowType, PostCardType } from "@/types";
import { createClient } from "@/utils/supabase/client";

export async function deletePost(id: string, imageUrl: string) {
  const supabase = createClient();

  // 기존 이미지 삭제
  const filePath = imageUrl.replace(
    "https://lfkxloulmqeonuzaudtt.supabase.co/storage/v1/object/public/user_upload_image/",
    ""
  );

  const { error: removeImageError } = await supabase.storage.from("user_upload_image").remove([filePath]);

  if (removeImageError) {
    console.error(`게시글 삭제 실패: ${removeImageError?.message}`);
    return;
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error || !id) {
    console.error(`게시글 삭제 실패: ${error?.message}`);
    return;
  }

  return Toast({ message: "게시글을 삭제했습니다.", type: "SUCCESS" });
}

export async function getPosts(category: string) {
  const supabase = createClient();
  if (category === "all") {
    const { data, error } = await supabase
      .from("posts")
      .select("*,category!inner(id, name, type), profiles(id, name, avatar_image)")
      .order("created_at", { ascending: false })
      .limit(10);
    if (!error) {
      return data as PostCardType[];
    } else return null;
  } else {
    const { data, error } = await supabase
      .from("posts")
      .select("*,category!inner(id, name, type), profiles(id, name, avatar_image)")
      .eq("category.type", category)
      .order("created_at", { ascending: false })
      .limit(10);
    if (!error) {
      return data as PostCardType[];
    } else return null;
  }
}

export async function getFollowPosts(category: string, user_id: string) {
  const supabase = createClient();

  const { data: followData, error: followError } = await supabase
    .from("follow")
    .select<"*", FollowType["Row"]>("*")
    .eq("follower_id", user_id);

  if (followError) throw followError;

  const ids = followData.map(f => f.following_id) ?? [];

  if (category === "all") {
    const { data, error } = await supabase
      .from("posts")
      .select("*,category!inner(id, name, type), profiles(id, name, avatar_image)")
      .in("user_id", ids)
      .order("created_at", { ascending: false })
      .limit(10);
    if (!error) {
      return data as PostCardType[];
    } else return null;
  } else {
    const { data, error } = await supabase
      .from("posts")
      .select("*,category!inner(id, name, type), profiles(id, name, avatar_image)")
      .eq("category.type", category)
      .in("user_id", ids)
      .order("created_at", { ascending: false })
      .limit(10);
    if (!error) {
      return data as PostCardType[];
    } else return null;
  }
}
