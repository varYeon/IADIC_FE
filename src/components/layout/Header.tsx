"use client";

import { useRouter } from "next/navigation";
import logoImg from "@/assets/images/header/logo_img.png";
import HeaderNav from "@/components/layout/HeaderNav";
import CircleProfileImage from "../common/image/CircleProfileImage";

export default function Header() {
  const route = useRouter();
  return (
    <header className="bg-bg-sub flex h-(--header-height) items-center justify-between rounded-none border-b border-gray-300 p-(--global-padding) px-5 pr-3 sm:px-10 2xl:rounded-t-[30px] dark:border-neutral-800">
      <div className="flex cursor-pointer gap-5" onClick={() => route.push("/posts/all")}>
        <CircleProfileImage src={logoImg} className="bg-bg-sub border-2 border-[#12659E]" size="sm" />
        <div className="text-center">
          <div className="text-[15px] font-bold text-[#12659E]">HOONSU</div>
          <div className="text-[10px] font-bold text-[#12659E]">TALK</div>
        </div>
      </div>
      <div>
        <div className="hidden sm:block"></div>
        <HeaderNav />
      </div>
    </header>
  );
}
