"use client";

import { Award, UserRoundPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BadgeType, FormState } from "@/types";
import BadgeDetail from "./BadgeDetail";
import { Button } from "../common/Button";
import { Divider } from "../common/Divider";
import Toast from "../common/toast/Toast";

type DisplayedBadgeModalFormProps = {
  setModal: () => void;
  action: (displayedBadgeList: (string | null)[]) => Promise<FormState>;
  displayedBadge: (BadgeType | null)[];
  haveBadge: BadgeType[] | null;
};
export default function DisplayedBadgeModal({
  setModal,
  action,
  displayedBadge,
  haveBadge,
}: DisplayedBadgeModalFormProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const router = useRouter();
  const [displayedBadgeList, setDisplayedBadgeList] = useState<(BadgeType | null)[]>(displayedBadge);
  const [isPending, setIsPending] = useState(false);

  //모달 내부는 클릭해도 사라지지 않게
  const preventOffModal = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleSave = async () => {
    setIsPending(true);
    const displayedBadgeId: (string | null)[] = displayedBadgeList.map(b => b?.id ?? null);
    const res = await action(displayedBadgeId);
    if (res.success) {
      Toast({ message: "대표 뱃지 업데이트를 성공했습니다.", type: "SUCCESS" });
      setIsPending(false);
      setModal();
      router.replace("/user/badge");
    } else {
      Toast({ message: "대표 뱃지 업데이트를 실패했습니다", type: "ERROR" });
      setIsPending(false);
    }
    return res;
  };
  const handleSelect = (b: BadgeType) => {
    setDisplayedBadgeList(prev => {
      if (!prev) return [b];
      if (prev.some(badge => badge?.id === b.id)) return prev;
      const newList = [...prev];
      const index = getIndex(newList);
      if (index === null) {
        Toast({ message: "전시 가능한 뱃지 수를 초과했습니다.", type: "ERROR" });
        return newList;
      }
      newList[index] = b;
      return newList;
    });
  };
  const handleDelete = (i: number) => {
    setDisplayedBadgeList(prev => {
      const newList = [...prev];
      newList[i] = null;
      return newList;
    });
  };
  const getIndex = (list: (BadgeType | null)[]) => {
    if (!list || list.length === 0) return 0;
    const index = list.findIndex(b => !b || !b.id);
    return index !== -1 ? index : null;
  };
  return (
    <>
      <div className="fixed inset-0 z-11 flex h-full w-full justify-center bg-gray-500/50 py-20" onMouseDown={setModal}>
        <div
          onMouseDown={preventOffModal}
          className="bg-bg-main z-12 h-fit max-h-[80vh] w-[80%] overflow-y-auto rounded-3xl p-12 max-sm:w-[90%] max-sm:p-9"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-1">
              <Award size={12} />
              <p>대표 뱃지</p>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-48 max-[760px]:max-w-60 max-xl:gap-25 max-lg:gap-16 max-sm:max-w-60 max-sm:gap-6">
                {!displayedBadgeList || displayedBadgeList.length === 0
                  ? [...Array(4)].map((_, i) => (
                      <div key={i}>
                        <BadgeDetail badgeData={null} />
                      </div>
                    ))
                  : displayedBadgeList.map((b, i) => (
                      <div key={i} onClick={() => handleDelete(i)}>
                        <BadgeDetail type="delete" badgeData={b} />
                      </div>
                    ))}
              </div>
            </div>
            <Divider />
            <div className="flex items-center gap-1">
              <Award size={12} />
              <p>얻은 뱃지</p>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-20 max-lg:gap-16 max-sm:max-w-full max-sm:gap-6">
                {haveBadge &&
                  haveBadge.length > 0 &&
                  haveBadge.map((b, i) => (
                    <div key={b?.id ?? i} onClick={() => handleSelect(b)}>
                      <BadgeDetail badgeData={b} type="update" />
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                size={"xs"}
                variant={"secondary"}
                onClick={() => {
                  handleSave();
                }}
                disabled={isPending}
              >
                <UserRoundPen size={12} className="mr-1" />
                {isPending ? "저장중" : "저장하기"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
