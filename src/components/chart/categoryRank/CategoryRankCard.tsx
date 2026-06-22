"use client";

import { usePathname, useRouter } from "next/navigation";
import Badge from "@/components/common/Badge";
import CircleProfileImage from "@/components/common/image/CircleProfileImage";
import ResponsiveContainer from "@/components/common/ResponsiveContainer";
import { categoryColor } from "@/utils/category";
import { metalClasses } from "@/utils/chart";
import AdoptRatioChart from "./AdoptRatioChart";
import ChartFillPie from "../ChartFillPie";

export default function CategoryRankCard({ stats }: { stats: categoryStatsType }) {
  const router = useRouter();
  const currentPath = usePathname();
  const color = categoryColor[stats.category_name];
  const adoptedPercent = stats.total_posts > 0 ? Math.round((stats.adopted_posts / stats.total_posts) * 100) : 0;
  const getBadgePercent = Math.round((stats.users_with_badge / stats.total_users) * 100);
  const badgeCountStat = stats.badge_counts.reduce((acc, cur) => acc * cur.achieved_count, 1);

  return (
    <ResponsiveContainer className="col-span-1 flex min-h-[360px] flex-col p-4.5 pl-5.5 whitespace-nowrap">
      <div className="mb-7.5 text-lg font-semibold" style={{ color }}>
        {stats.category_name}
      </div>
      <div className="flex w-full flex-wrap gap-5">
        <div className="flex w-full max-w-40 flex-col gap-2 md:max-w-[200px]">
          <div className="flex gap-8">
            <div className="flex flex-col gap-1">
              <div className="text-text-title mb-0.5 text-[15px] font-semibold">총 Exp</div>
              <div className="text-text-sub text-[16px]">{stats.total_point?.toLocaleString()}P</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-text-title mb-0.5 text-[15px] font-semibold">평균 훈수</div>
              <div className="text-text-sub text-[16px]">{stats.avg_comments} 개</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="text-text-title text-[15px] font-semibold">키워드 TOP3</div>
          <div className="flex gap-3">
            {!stats.topkeywords[0] && (
              <Badge size="md" className="bg-text-sub px-2 py-1 text-white" text="지표가 부족합니다" />
            )}
            {stats.topkeywords[0] &&
              stats.topkeywords.map((keyword, index) => (
                <Badge
                  key={index}
                  size="md"
                  className="text-bg-main px-2 py-1 font-semibold"
                  text={keyword}
                  style={{ backgroundColor: color }}
                />
              ))}
          </div>
        </div>
      </div>

      <div className="border-border-sub my-6 mt-7 border-t" />

      <div className="flex w-full flex-col gap-2">
        <div className="text-text-title text-[15px] font-semibold">랭킹 TOP3</div>
        <div className="grid max-w-[320px] cursor-pointer grid-cols-3 items-center justify-center gap-5">
          {!stats.topusers[0] && (
            <div className="min-h-[98px]">
              <Badge size="md" className="bg-text-sub px-2 py-1 text-white" text="지표가 부족합니다" />
            </div>
          )}
          {stats.topusers?.map((user, index) => {
            return (
              <div
                key={user.user_id}
                className={`relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-xl p-2 py-2.5 font-semibold shadow-sm before:absolute before:inset-0 before:opacity-15 before:content-[''] ${metalClasses[index]} `}
                onClick={() => {
                  const next = new URLSearchParams();
                  next.set("user", user.user_id);
                  router.push(`${currentPath}?${next.toString()}`);
                }}
              >
                <CircleProfileImage
                  src={
                    user.avatar_image ||
                    "https://lfkxloulmqeonuzaudtt.supabase.co/storage/v1/object/public/user_upload_image/default_user_image.svg"
                  }
                  size="md"
                  className="border-none"
                />
                <span className="text-xs font-semibold text-black">{user.user_name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-border-sub my-6 mt-7 border-t" />

      <div className="flex w-full flex-wrap gap-5 md:gap-8">
        <div className="flex w-full max-w-[250px] flex-col gap-3">
          <div className="text-text-title text-[15px] font-semibold">지표</div>
          <div className="flex gap-3">
            <AdoptRatioChart label="채택률" percentage={adoptedPercent} color={color} />
            <AdoptRatioChart label="사용자별 뱃지" percentage={getBadgePercent} color={color} />
          </div>
        </div>
        <div className="flex min-w-[110px] flex-col gap-1.5 md:min-w-[120px]">
          <div className="text-text-title text-[15px] font-semibold">업적별 뱃지</div>
          <div className="h-[120px]">
            {!badgeCountStat && (
              <Badge size="md" className="bg-text-sub text-bg-main px-2 py-1 font-semibold" text="지표가 부족합니다" />
            )}
            {!!badgeCountStat && <ChartFillPie stats={stats.badge_counts} />}
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
}
