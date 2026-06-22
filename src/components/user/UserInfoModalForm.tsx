"use client";

import { SquarePen, UserRoundPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { BadgeType, FormState } from "@/types";
import { Button } from "../common/Button";
import CircleProfileImage from "../common/image/CircleProfileImage";
import Toast from "../common/toast/Toast";

type UserInfoModalFormProps = {
  profile: UserProfile;
  setModal: () => void;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  haveBadge: BadgeType[] | null;
};
export default function UserInfoModalForm({ profile, setModal, action, haveBadge }: UserInfoModalFormProps) {
  const [state, formAction, isPending] = useActionState(action, { success: false, error: null, result: null });
  const router = useRouter();
  const [preview, setPreview] = useState(profile?.avatar_image);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (state.error) {
      Toast({ message: String(state.error), type: "ERROR" });
    } else if (state.success && !state.error) {
      Toast({ message: "프로필이 성공적으로 업데이트 되었습니다.", type: "SUCCESS" });
      setModal();
      router.push("/user/profile");
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [setModal, router, state]);

  //모달 내부는 클릭해도 사라지지 않게
  const preventOffModal = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size === 0) return;

    if (file.size > 1024 * 1024) {
      Toast({ message: "이미지 파일은 1MB 이하만 업로드 가능합니다.", type: "ERROR" });
      return;
    }

    if (!file.type.startsWith("image/")) {
      Toast({ message: "이미지 파일만 업로드할 수 있습니다.", type: "ERROR" });
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <>
      <div className="fixed inset-0 z-11 flex h-full w-full justify-center bg-gray-500/50 py-20" onMouseDown={setModal}>
        <form
          action={formAction}
          className="bg-bg-main z-12 h-fit w-[70%] rounded-3xl p-12 max-sm:w-[90%] max-sm:p-9"
          onMouseDown={preventOffModal}
        >
          <div className="mb-3 flex items-center gap-3">
            <label htmlFor="avatarImageUpload" className="relative">
              <div className="rounded-lg bg-gray-100">
                <CircleProfileImage src={preview ?? "/profile_sample.svg"} size="lg" className="brightness-90" />
              </div>
              <div className="absolute inset-3.5 flex cursor-pointer items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition ease-in-out hover:brightness-120">
                <div className="z-20">
                  <SquarePen size={16} color="#ffffff" />
                </div>
              </div>
            </label>

            <input
              type="file"
              id="avatarImageUpload"
              name="avatarImage"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="flex flex-col gap-2">
              <label className="text-text-sub">
                닉네임<span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2 max-sm:flex-col max-sm:gap-0">
                <select className="px-2 py-1.5 outline-none" name="titleBadge" defaultValue={profile?.badge?.id ?? ""}>
                  <option value={""}>칭호 없음</option>
                  {haveBadge &&
                    haveBadge.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                </select>
                <input
                  type="text"
                  name="name"
                  defaultValue={profile?.name}
                  placeholder="이름을 입력하세요."
                  className="border-bg-sub min-w-42 rounded-lg border px-2 py-1.5 outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 text-xs">
            <p className="text-text-light">개인정보</p>
            <div className="flex flex-col flex-wrap gap-16 max-sm:gap-12">
              <div className="flex flex-col gap-2">
                <label className="text-text-sub">
                  이메일<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="email"
                  defaultValue={profile?.email}
                  placeholder="이메일을 입력하세요."
                  readOnly
                  className="border-bg-sub bg-bg-sub max-w-[60%] rounded-lg border px-2 py-1.5 outline-none max-sm:max-w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-text-sub">전화번호</label>
                <input
                  type="text"
                  name="phoneNumber"
                  defaultValue={profile?.phone_number ? String(profile?.phone_number) : ""}
                  placeholder="전화번호를 입력하세요."
                  className="border-bg-sub max-w-[60%] rounded-lg border px-2 py-1.5 outline-none max-sm:max-w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-text-sub">한줄 소개</label>
                <input
                  type="text"
                  name="bio"
                  defaultValue={profile?.bio ?? ""}
                  placeholder="한줄 소개를 입력하세요."
                  className="border-bg-sub max-w-[60%] rounded-lg border px-2 py-1.5 outline-none max-sm:max-w-full"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button size={"xs"} variant={"secondary"} type="submit" disabled={isPending}>
                <UserRoundPen size={12} className="mr-1" />
                {isPending ? "저장중" : "저장하기"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
