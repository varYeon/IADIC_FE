import { createClient } from "@/utils/supabase/server";

export async function updateProfile(
  userId: string,
  name: string,
  email: string,
  phoneNumber: string,
  bio: string,
  avatarImage?: string | null,
  titleBadge?: string | null
) {
  const supabase = await createClient();
  if (avatarImage) {
    const { error: updateErrors } = await supabase
      .from("profiles")
      .update({ name, email, phone_number: phoneNumber, bio, avatar_image: avatarImage, title_badge: titleBadge })
      .eq("id", userId);

    if (updateErrors) {
      return {
        success: false,
        error: "프로필 저장중에 문제가 발생하였습니다.",
        result: null,
      };
    }
    return { success: true, error: null, result: null };
  } else {
    const { error: updateErrors } = await supabase
      .from("profiles")
      .update({ name, email, phone_number: phoneNumber, bio, title_badge: titleBadge })
      .eq("id", userId);

    if (updateErrors) {
      return {
        success: false,
        error: "프로필 저장중에 문제가 발생하였습니다.",
        result: null,
      };
    }
    return { success: true, error: null, result: null };
  }
}
