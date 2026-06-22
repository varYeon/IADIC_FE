import { ActivityIcon, ArrowRightToLineIcon, Award, UserRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Divider } from "@/components/common/Divider";
import ResponsiveContainer from "@/components/common/ResponsiveContainer";
import BadgeDetail from "@/components/user/BadgeDetail";
import UserInfo from "@/components/user/UserInfo";
import { updateProfile } from "@/services/profile/updateProfile";
import { BadgeType, FormState } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [
    { data: profileData },
    { count: followCnt },
    { count: followerCnt },
    { count: postCnt },
    { data: adoptedComments },
    { data: displayedBadge },
    { data: haveBadgeData },
  ] = await Promise.all([
    supabase.from("profiles").select("*, badge(*, category(name))").eq("id", user.id).single(),
    supabase.from("follow").select("*", { count: "exact", head: true }).eq("follower_id", user.id),
    supabase.from("follow").select("*", { count: "exact", head: true }).eq("following_id", user.id),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("comments").select("id, posts:post_id(adopted_comment_id)").eq("user_id", user.id),
    supabase
      .from("displayed_badge")
      .select(
        `badge_first:badge!displayed_badge_first_fkey(*),
        badge_second:badge!displayed_badge_second_fkey(*),
        badge_third:badge!displayed_badge_third_fkey(*),
        badge_fourth:badge!displayed_badge_fourth_fkey(*)`
      )
      .eq("user_id", user.id)
      .single(),
    supabase.from("user_badge").select("*, badge(*)").eq("user_id", user.id),
  ]);

  const profile = profileData ?? null;
  const followCount = followCnt ?? 0;
  const followerCount = followerCnt ?? 0;
  const postCount = postCnt ?? 0;
  const adoptedCommentCount =
    adoptedComments?.filter(d => d.posts?.adopted_comment_id && d.id === d.posts?.adopted_comment_id).length ?? 0;
  const displayedBadgeList: (BadgeType | null)[] = [
    displayedBadge?.badge_first ?? null,
    displayedBadge?.badge_second ?? null,
    displayedBadge?.badge_third ?? null,
    displayedBadge?.badge_fourth ?? null,
  ];
  const flatHaveBadge = (haveBadgeData ?? []).reduce<BadgeType[]>((arr, b) => [...arr, b.badge], []);

  async function updateProfileAction(prevState: FormState, formData: FormData): Promise<FormState> {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
        result: null,
      };
    }

    const name = formData.get("name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const phoneNumber = formData.get("phoneNumber")?.toString().replaceAll(" ", "").replaceAll(/[\D]/gi, "") ?? "";
    const bio = formData.get("bio")?.toString() ?? "";
    const avatarImage = formData.get("avatarImage") as File | null;
    const titleBadgeData = formData.get("titleBadge")?.toString();
    const titleBadge = titleBadgeData === "" ? null : titleBadgeData;
    let avatarImageUrl: string = "";

    if (avatarImage && avatarImage.size > 0) {
      // 파일 확장자 추출
      const ext = avatarImage.name.split(".").pop();
      // user당 하나 주어지는 name...을 원하지만, 파일 확장자에 따라 여러개 생길 수 있음
      const filePath = `avatars/${user.id}.${ext}`;

      // 업로드
      const { error } = await supabase.storage
        .from("user_upload_image")
        .upload(filePath, avatarImage, { upsert: true });

      if (error) {
        console.error("Upload error:", error);
        return {
          success: false,
          error: "이미지 업로드 실패",
          result: null,
        };
      } else {
        const { data } = supabase.storage.from("user_upload_image").getPublicUrl(filePath);
        avatarImageUrl = `${data.publicUrl}?t=${Date.now()}`;
      }
    }

    if (!name || !email) {
      return {
        success: false,
        error: "필수 항목을 채워주세요",
        result: null,
      };
    }

    if (phoneNumber.length !== 11 && phoneNumber.length !== 0) {
      return {
        success: false,
        error: "올바른 전화번호를 입력해주세요.",
        result: null,
      };
    }
    if (name.length > 10) {
      return {
        success: false,
        error: "이름은 10자 이내로 작성해주세요.",
        result: null,
      };
    }
    if (bio.length > 30) {
      return {
        success: false,
        result: null,
        error: "한줄 소개는 30자 이내로 작성해주세요.",
      };
    }
    if (!avatarImage || avatarImage.size === 0) {
      return updateProfile(user.id, name, email, phoneNumber, bio, null, titleBadge);
    }
    return updateProfile(user.id, name, email, phoneNumber, bio, avatarImageUrl, titleBadge);
  }

  return (
    <div className="mt-6.5 w-full pb-5 text-xs">
      <UserInfo profile={profile} action={updateProfileAction} haveBadge={flatHaveBadge} />
      <Divider />
      <div className="my-6 flex flex-wrap justify-center gap-3 text-xs max-lg:flex-col">
        <ResponsiveContainer className="flex flex-col flex-wrap gap-12 p-6 max-sm:gap-14 max-sm:rounded-3xl">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1">
              <UserRound size={12} />
              <p>연결 관리</p>
            </div>
            <div className="flex justify-center gap-6">
              <div className="border-border-main flex min-w-32.5 flex-col gap-2 rounded-xl border px-3.5 pt-3 pb-2 max-[360px]:min-w-[40%]">
                <p>팔로잉</p>
                <p className="text-base">{followCount}</p>
              </div>
              <div className="border-border-main flex min-w-32.5 flex-col gap-2 rounded-xl border px-3.5 pt-3 pb-2 max-[360px]:min-w-[40%]">
                <p>팔로워</p>
                <p className="text-base">{followerCount}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1">
              <ActivityIcon size={12} />
              <p>내 활동</p>
            </div>
            <div className="flex justify-center gap-6">
              <div className="bg-bg-sub flex min-w-32.5 flex-col gap-2 rounded-xl px-3.5 pt-3 pb-2 max-[360px]:min-w-[40%]">
                <p>게시물</p>
                <p className="text-base">{postCount}</p>
              </div>
              <div className="bg-bg-sub flex min-w-32.5 flex-col gap-2 rounded-xl px-3.5 pt-3 pb-2 max-[360px]:min-w-[40%]">
                <p>채택 수</p>
                <p className="text-base">{adoptedCommentCount}</p>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
        <ResponsiveContainer className="flex-1 p-6 max-lg:min-w-63 max-sm:min-w-0 max-sm:rounded-3xl max-sm:pb-3">
          <div className="flex flex-col gap-6 max-sm:gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Award size={12} />
                <p>마이 뱃지</p>
              </div>
              <p className="text-text-light">대표로 설정한 4개의 뱃지만 표시</p>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-16 max-[1180px]:max-w-65 max-[1180px]:gap-8 max-sm:grid max-sm:grid-cols-2 max-sm:gap-6">
                {!displayedBadgeList || displayedBadgeList.length === 0
                  ? [...Array(4)].map((_, i) => (
                      <div key={i}>
                        <BadgeDetail badgeData={null} />
                      </div>
                    ))
                  : displayedBadgeList.map((b, i) => (
                      <div key={i}>
                        <BadgeDetail badgeData={b} />
                      </div>
                    ))}
              </div>
            </div>
            <Link href="badge" className="text-main flex items-center justify-end gap-2 px-3 py-1.5 text-xs">
              <ArrowRightToLineIcon size={10} />
              전체 뱃지 보기
            </Link>
          </div>
        </ResponsiveContainer>
      </div>
      {/* <ResponsiveContainer className="flex-1 p-6 max-sm:rounded-3xl">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1">
            <ChartLine size={12} />
            <p>내 통계</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-sm:flex-col">
            <CategoryRanking Field="버거 분야" current={50} total={100} />
            <CategoryRanking Field="버거 분야" current={50} total={100} />
            <CategoryRanking Field="버거 분야" current={50} total={100} />
          </div>
          <Link href="/chart" className="text-main flex items-center justify-end gap-2 px-3 py-1.5 text-xs">
            <ArrowRightToLineIcon size={10} />
            모든 랭킹 보기
          </Link>
        </div>
      </ResponsiveContainer> */}
    </div>
  );
}
