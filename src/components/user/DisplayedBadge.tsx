"use client";

import { Award, UserRoundPen } from "lucide-react";
import { useState } from "react";
import { BadgeType, FormState } from "@/types";
import BadgeDetail from "./BadgeDetail";
import DisplayedBadgeModal from "./DisplayedBadgeModal";
import { Button } from "../common/Button";
import ResponsiveContainer from "../common/ResponsiveContainer";

type DisplayedBadgeProps = {
  action: (displayedBadgeList: (string | null)[]) => Promise<FormState>;
  displayedBadge: (BadgeType | null)[];
  haveBadge: BadgeType[] | null;
};
export default function DisplayedBadge({ action, displayedBadge, haveBadge }: DisplayedBadgeProps) {
  const [modalStatus, setModalStatus] = useState(false);
  const onHandleModalStatus = () => {
    setModalStatus(prev => !prev);
  };
  return (
    <>
      <ResponsiveContainer className="flex-1 p-6 max-sm:border-none max-sm:px-0">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-1">
            <Award size={12} />
            <p>대표 뱃지</p>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-52 max-xl:gap-25 max-lg:max-w-80 max-lg:gap-16 max-sm:max-w-50 max-sm:gap-6">
              {!displayedBadge || displayedBadge.length === 0
                ? [...Array(4)].map((_, i) => <BadgeDetail key={i} badgeData={null} />)
                : displayedBadge.map((b, i) => <BadgeDetail key={i} badgeData={b ?? null} />)}
            </div>
          </div>
          <div className="flex justify-end">
            <Button size={"xs"} variant={"secondary"} onClick={onHandleModalStatus}>
              <UserRoundPen size={12} className="mr-1" />
              수정하기
            </Button>
          </div>
        </div>
      </ResponsiveContainer>
      {modalStatus && (
        <DisplayedBadgeModal
          setModal={onHandleModalStatus}
          action={action}
          displayedBadge={displayedBadge}
          haveBadge={haveBadge}
        />
      )}
    </>
  );
}
