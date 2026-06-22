import { Book } from "lucide-react";
import { redirect } from "next/navigation";
import { cache } from "react";
import { twMerge } from "tailwind-merge";
import { Divider } from "@/components/common/Divider";
import ResponsiveContainer from "@/components/common/ResponsiveContainer";
import BadgeDetail from "@/components/user/BadgeDetail";
import DisplayedBadge from "@/components/user/DisplayedBadge";
import { updateDisplayedBadge } from "@/services/profile/updateDisplayedBadge";
import { BadgeType, CategoryType } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function page() {
  const supabase = await createClient();

  //userID, 카테고리 리스트, 기본 뱃지 리스트 데이터 패칭
  const [{ data: userData }, { data: badgeCategoryData }, { data: basicBadgeListData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("category").select("*"),
    supabase.from("badge").select("*").eq("type", "basic").order("desc"),
  ]);

  if (!userData.user?.id) {
    redirect("/");
  }

  const userId = userData.user?.id;
  const badgeCategory: CategoryType[] | null = badgeCategoryData ?? null;
  const basicBadgeList = basicBadgeListData ?? null;

  //카테고리 뱃지 리스트를 불러오는 함수
  const getCategoryBadgeList = cache(async (): Promise<Record<string, BadgeType[] | null>> => {
    const badge: Record<string, BadgeType[] | null> = {};

    await Promise.all(
      (badgeCategory ?? []).map(async (c: { id: string; name: string | null }) => {
        const { data } = await supabase
          .from("badge")
          .select("*")
          .eq("category_id", c.id)
          .order("desc", { ascending: true });
        badge[c.id] = data;
      })
    );
    return badge;
  });

  //카테고리 뱃지 리스트, 내가 가진 뱃지, 프로필 데이터 패칭
  const [categoryBadgeListData, { data: haveBadgeData }, { data: displayedBadgeListData }] = await Promise.all([
    getCategoryBadgeList(),
    supabase.from("user_badge").select("*, badge(*)").eq("user_id", userId),
    supabase
      .from("displayed_badge")
      .select(
        `badge_first:badge!displayed_badge_first_fkey(*),
        badge_second:badge!displayed_badge_second_fkey(*),
        badge_third:badge!displayed_badge_third_fkey(*),
        badge_fourth:badge!displayed_badge_fourth_fkey(*)`
      )
      .eq("user_id", userId)
      .single(),
  ]);

  const displayedBadgeList: (BadgeType | null)[] = [
    displayedBadgeListData?.badge_first ?? null,
    displayedBadgeListData?.badge_second ?? null,
    displayedBadgeListData?.badge_third ?? null,
    displayedBadgeListData?.badge_fourth ?? null,
  ];

  const categoryBadgeList = categoryBadgeListData ?? {};
  const flatHaveBadgeList = (haveBadgeData ?? []).reduce<string[]>((arr, b) => [...arr, b.badge_id], []);
  const flatHaveBadge = (haveBadgeData ?? []).reduce<BadgeType[]>((arr, b) => [...arr, b.badge], []);

  async function updateDisplayBadgeAction(displayedBadgeList: (string | null)[]) {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      console.error(userError);
      return { success: false, error: "유저 정보를 가져오지 못했습니다.", result: null };
    }
    return updateDisplayedBadge(user.id, displayedBadgeList);
  }

  return (
    <div className="mt-6.5 flex w-full flex-col gap-3.5 text-xs">
      <DisplayedBadge action={updateDisplayBadgeAction} displayedBadge={displayedBadgeList} haveBadge={flatHaveBadge} />
      <ResponsiveContainer className="flex-1 p-6 max-sm:border-none max-sm:px-0">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-1">
            <Book size={12} />
            <p>뱃지 도감</p>
          </div>
          {/* basic 뱃지 */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-[15px] font-medium">기본</p>
              <div className="flex snap-x snap-mandatory justify-start gap-16 overflow-x-auto scroll-smooth pb-1 max-sm:py-3">
                {basicBadgeList?.map(b => (
                  <BadgeDetail
                    key={b.id}
                    badgeData={b}
                    className={twMerge("shrink-0 snap-start", !flatHaveBadgeList.includes(b.id) && "opacity-50")}
                  />
                ))}
              </div>
              <Divider className="mt-3 max-sm:hidden" />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {badgeCategory?.map(c => (
              <div key={c.id} className="flex flex-col gap-2">
                <p className="text-[15px] font-medium">{c.name}</p>
                <div className="flex snap-x snap-mandatory justify-start gap-16 overflow-x-auto scroll-smooth pb-1 max-sm:py-3">
                  {categoryBadgeList[c.id]?.map(b => (
                    <BadgeDetail
                      key={b.id}
                      badgeData={b}
                      className={twMerge("shrink-0 snap-start", !flatHaveBadgeList.includes(b.id) && "opacity-50")}
                    />
                  ))}
                </div>
                <Divider className="mt-3 max-sm:hidden" />
              </div>
            ))}
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
