"use client";

import { createClient } from "../supabase/client";

type BadgesType = {
  badge_image: string | null;
  category_id: string | null;
  desc: string;
  id: string;
  name: string;
  point: number | null;
  type: string | null;
};

export function extractCount(desc: string) {
  const match = desc.match(/([0-9]+)회/);
  return match ? Number(match[1]) : 1;
}

export function calculateLevel(exp: number) {
  const level = Math.floor(exp / 1000) + 1;
  return level;
}

export async function updateExpLevel(user_id: string, addExp: number) {
  const supabase = createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("exp, level")
    .eq("id", user_id)
    .single();

  if (profileError) throw profileError;

  const newExp = (profile.exp ?? 0) + addExp;
  const newLevel = calculateLevel(newExp);

  await supabase.from("profiles").update({ exp: newExp, level: newLevel }).eq("id", user_id);

  return {
    newExp,
    newLevel,
    leveledUp: newLevel > profile.level!,
  };
}

export async function badgeAdopt(user_id: string, category_id: string) {
  const supabase = createClient();

  const { data: postData, error: postError } = await supabase.from("posts").select("id").eq("category_id", category_id);

  if (postError) throw postError;
  const postIds = postData?.map(p => p.id) || [];

  const { data: badges, error: badgesError } = await supabase
    .from("badge")
    .select("*")
    .or(`type.eq.basic, and(type.eq.category, category_id.eq.${category_id})`)
    .like("desc", "%채택%");

  if (badgesError) throw badgesError;

  const { data: existingBadges } = await supabase.from("user_badge").select("badge_id").eq("user_id", user_id);

  const existingBadgeIds = existingBadges?.map(b => b.badge_id) || [];

  const { data: commentData, error: commentError } = await supabase
    .from("comments")
    .select("id, post_id")
    .eq("user_id", user_id);

  if (commentError) throw commentError;
  const commentIds = commentData?.map(c => c.id) || [];
  if (commentIds.length === 0) return;

  for (const badge of badges) {
    if (existingBadgeIds.includes(badge.id)) continue;

    if (badge.name === "훈수 아닌 조언") {
      const { count: adoptedCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .in("adopted_comment_id", commentIds);

      if (adoptedCount && adoptedCount > 0) {
        await supabase.from("user_badge").insert({ user_id, badge_id: badge.id });
        await updateExpLevel(user_id, badge.point ?? 0);
      }
      continue;
    }

    const required = extractCount(badge.desc);
    const targetPostIds = badge.type === "category" ? postIds : undefined;

    const { count } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .in("adopted_comment_id", commentIds)
      .in("id", targetPostIds || []);

    if (count && count >= required) {
      await supabase.from("user_badge").insert({ user_id, badge_id: badge.id });
      await updateExpLevel(user_id, badge.point ?? 0);
    }
  }

  return;
}

export async function badgeLikesReceived(user_id: string) {
  const supabase = createClient();

  const { data: myComments } = await supabase.from("comments").select("id").eq("user_id", user_id);

  const myCommentIds = myComments?.map(c => c.id) || [];
  if (myCommentIds.length === 0) return [];

  const { count: likeCount } = await supabase
    .from("comment_reactions")
    .select("*", { count: "exact", head: true })
    .eq("type", "like")
    .in("comment_id", myCommentIds);

  const { data: badges, error: badgesError } = await supabase
    .from("badge")
    .select("*")
    .eq("type", "basic")
    .like("desc", "%좋아요 받기%");

  if (badgesError) throw badgesError;

  return await processBadge(user_id, badges, likeCount ?? 0);
}

export async function badgeLikesGiven(user_id: string) {
  const supabase = createClient();

  const { count: likeCount } = await supabase
    .from("comment_reactions")
    .select("*", { count: "exact", head: true })
    .eq("type", "like")
    .eq("user_id", user_id);

  const { data: badges, error: badgesError } = await supabase
    .from("badge")
    .select("*")
    .eq("type", "basic")
    .like("desc", "%좋아요 하기%");

  if (badgesError) throw badgesError;

  return await processBadge(user_id, badges, likeCount ?? 0);
}

async function processBadge(user_id: string, badges: BadgesType[], count: number) {
  const supabase = createClient();
  const results = [];

  for (const badge of badges ?? []) {
    const required = extractCount(badge.desc);

    if (count >= required) {
      const { data: exists } = await supabase
        .from("user_badge")
        .select("id")
        .eq("user_id", user_id)
        .eq("badge_id", badge.id)
        .maybeSingle();

      if (!exists) {
        await supabase.from("user_badge").insert({
          user_id,
          badge_id: badge.id,
        });

        const profileUpdate = await updateExpLevel(user_id, badge.point ?? 0);

        results.push({
          badgeName: badge.name,
          addedExp: badge.point,
          ...profileUpdate,
        });
      }
    }
  }

  return results;
}
