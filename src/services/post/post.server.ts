import { FormState, PostCardType, PostDetailType, PostInsertType, PostUpdateType } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function createPost(postData: PostInsertType): Promise<[FormState, PostInsertType | null]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").insert([postData]).select().maybeSingle();

  if (error) {
    return [
      {
        success: false,
        error: `게시글 업로드 실패: ${error.message}`,
        result: null,
      },
      null,
    ];
  }

  return [{ success: true, error: null, result: null }, data];
}

export async function updatePost(id: string, updateData: PostUpdateType): Promise<[FormState, PostInsertType | null]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").update(updateData).eq("id", id);

  if (error || !id) {
    return [
      {
        success: false,
        error: `게시글 업데이트 실패: ${error?.message}`,
        result: null,
      },
      null,
    ];
  }

  return [{ success: true, error: null, result: null }, data];
}

export async function getPosts(category: string) {
  const supabase = await createClient();
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

export async function getDetailPost(postId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(id, name, avatar_image)")
    .eq("id", postId)
    .maybeSingle();

  if (!error) {
    return data as PostDetailType;
  } else return null;
}
