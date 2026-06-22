import { createClient } from "../supabase/server";

export function extractCount(desc: string) {
  const match = desc.match(/([0-9]+)회/);
  return match ? Number(match[1]) : 1;
}

export function calculateLevel(exp: number) {
  const level = Math.floor(exp / 1000) + 1;
  return level;
}

export async function updateExpLevel(user_id: string, addExp: number) {
  const supabase = await createClient();

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

export const achievePost = async (user_id: string, category_id: string) => {
  const supabase = await createClient();

  const { data: badges, error: badgesError } = await supabase
    .from("badge")
    .select("*")
    .or(`type.eq.basic, and(type.eq.category, category_id.eq.${category_id})`)
    .like("desc", "%게시글%");

  if (badgesError) throw badgesError;

  const results = [];
  for (const badge of badges) {
    const required = extractCount(badge.desc);

    let count = 0;

    if (badge.type === "category") {
      const { count: c } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user_id)
        .eq("category_id", category_id);
      if (c) count = c;
    } else {
      const { count: c } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user_id);
      if (c) count = c;
    }

    if (count >= required) {
      const { data: exists } = await supabase
        .from("user_badge")
        .select("id")
        .eq("user_id", user_id)
        .eq("badge_id", badge.id)
        .maybeSingle();

      if (!exists) {
        await supabase.from("user_badge").insert({
          user_id: user_id,
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
};

export const badgeComments = async (user_id: string, category_id: string) => {
  const supabase = await createClient();

  const { data: postData, error: postError } = await supabase.from("posts").select("id").eq("category_id", category_id);

  if (postError) throw postError;
  const postIds = postData?.map(p => p.id) || [];

  const { data: badges, error: badgesError } = await supabase
    .from("badge")
    .select("*")
    .or(`type.eq.basic, and(type.eq.category, category_id.eq.${category_id})`)
    .like("desc", "%답변%");

  if (badgesError) throw badgesError;

  const results = [];
  for (const badge of badges) {
    const required = extractCount(badge.desc);

    let count = 0;

    if (badge.type === "category") {
      const { count: c } = await supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user_id)
        .in("post_id", postIds);
      if (c) count = c;
    } else {
      const { count: c } = await supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user_id);
      if (c) count = c;
    }

    if (count >= required) {
      const { data: exists } = await supabase
        .from("user_badge")
        .select("id")
        .eq("user_id", user_id)
        .eq("badge_id", badge.id)
        .maybeSingle();

      if (!exists) {
        await supabase.from("user_badge").insert({ user_id: user_id, badge_id: badge.id });

        const profileUpdate = await updateExpLevel(user_id, badge.point ?? 0);

        results.push({ badgeName: badge.name, addedExp: badge.point, ...profileUpdate });
      }
    }
  }

  return results;
};
