import { FormState } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function updateDisplayedBadge(userId: string, displayedBadgeList: (string | null)[]): Promise<FormState> {
  const supabase = await createClient();
  const { data: displayedBadge } = await supabase
    .from("displayed_badge")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!displayedBadge) {
    const { error: updateErrors } = await supabase.from("displayed_badge").insert({
      user_id: userId,
      first: displayedBadgeList[0],
      second: displayedBadgeList[1],
      third: displayedBadgeList[2],
      fourth: displayedBadgeList[3],
    });

    if (updateErrors) {
      return { success: false, error: "대표 배지 업데이트 실패", result: null };
    }
  } else {
    const { error: updateErrors } = await supabase
      .from("displayed_badge")
      .update({
        first: displayedBadgeList[0],
        second: displayedBadgeList[1],
        third: displayedBadgeList[2],
        fourth: displayedBadgeList[3],
      })
      .eq("user_id", userId);
    if (updateErrors) {
      return { success: false, error: "대표 배지 업데이트 실패", result: null };
    }
  }

  return { success: true, error: null, result: null };
}
