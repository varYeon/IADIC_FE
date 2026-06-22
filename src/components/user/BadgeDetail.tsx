"use client";

import { BadgeCheck, BadgeX } from "lucide-react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { BadgeType } from "@/types";

type BadgeDetailProps = {
  badgeData: BadgeType | null;
  className?: string;
  type?: "display" | "update" | "delete";
};

export default function BadgeDetail({ badgeData, className, type = "display" }: BadgeDetailProps) {
  return (
    <>
      <div className={twMerge(className, "flex w-20 flex-col items-center gap-1")}>
        {badgeData?.badge_image ? (
          <div
            className={twMerge(
              "group relative rounded-full",
              type === "delete" && "hover:black/70",
              type === "update" && "hover:bg-main/70"
            )}
          >
            <Image
              src={badgeData.badge_image}
              alt={badgeData.name}
              width={70}
              height={70}
              className={twMerge(
                "border-bg-sub rounded-full border",
                type === "update" && "group-hover:opacity-40",
                type === "delete" && "group-hover:brightness-80"
              )}
              loading="eager"
              quality={100}
            />
            {type === "update" && (
              <div className="absolute inset-1 hidden items-center justify-center group-hover:flex">
                <BadgeCheck color="white" size={25} />
              </div>
            )}
            {type === "delete" && (
              <div className="absolute inset-1 hidden items-center justify-center group-hover:flex">
                <BadgeX color="white" size={25} />
              </div>
            )}
          </div>
        ) : (
          <div className="border-bg-sub h-[70px] w-[70px] rounded-full border"></div>
        )}
        <p className="text-center text-sm font-medium break-keep">{badgeData?.name ?? "-"}</p>
        <p className="text-text-light text-center text-xs break-keep">{badgeData?.desc ?? "선택 가능"}</p>
      </div>
    </>
  );
}
