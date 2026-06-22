"use client";

import { UserRoundPen } from "lucide-react";
import { useState } from "react";
import { BadgeType, FormState } from "@/types";
import { categoryColor } from "@/utils/category";
import UserInfoModalForm from "./UserInfoModalForm";
import Badge from "../common/Badge";
import { Button } from "../common/Button";
import CircleProfileImage from "../common/image/CircleProfileImage";

type UserInfoProps = {
  profile: UserProfile;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  haveBadge: BadgeType[] | null;
};

export default function UserInfo({ profile, action, haveBadge }: UserInfoProps) {
  const [modalStatus, setModalStatus] = useState(false);
  const onHandleModalStatus = () => {
    setModalStatus(prev => !prev);
  };

  return (
    <>
      <div className="p-6">
        <div className="mb-3 flex items-center gap-3">
          <CircleProfileImage src={profile?.avatar_image ?? "/profile_sample.svg"} size="lg" />
          <div className="flex flex-col gap-2">
            <Badge size="sm" text={`LV.${profile?.level}`} className="bg-main text-white" />
            <div className="flex items-center gap-2">
              <p className="font-medium">{profile?.name}</p>
              {profile?.badge?.name && (
                <Badge
                  size="sm"
                  text={profile?.badge?.name ?? "칭호 없음"}
                  className="text-white"
                  style={
                    profile.badge?.type === "category"
                      ? {
                          backgroundColor: categoryColor[profile.badge.category.name],
                        }
                      : { backgroundColor: "#999999" }
                  }
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 text-xs">
          <p className="text-text-light">개인정보</p>
          <div className="flex flex-wrap gap-56 max-[1517px]:gap-16 max-lg:flex-col max-sm:gap-8">
            <div>
              <p className="text-text-sub mb-3">이메일</p>
              <p>{profile?.email}</p>
            </div>
            <div>
              <p className="text-text-sub mb-3">전화번호</p>
              <p>{profile?.phone_number ?? "-"}</p>
            </div>
            <div>
              <p className="text-text-sub mb-3 break-keep">한줄 소개</p>
              <p>{profile?.bio ?? "-"}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size={"xs"} variant={"secondary"} onClick={onHandleModalStatus}>
              <UserRoundPen size={12} className="mr-1" />
              수정하기
            </Button>
          </div>
        </div>
      </div>
      {modalStatus && (
        <UserInfoModalForm profile={profile} setModal={onHandleModalStatus} action={action} haveBadge={haveBadge} />
      )}
    </>
  );
}
