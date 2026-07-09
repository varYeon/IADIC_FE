import { ChevronDown } from "lucide-react";
import Skeleton from "../common/Skeleton";

export default function SearchResultSkeleton() {
  return (
    <div className="md:border-border-main flex flex-col gap-6 rounded-3xl pt-12 md:border md:p-6">
      <div className="relative flex justify-between">
        <div className="flex items-center text-xs">
          <p className="text-content">검색 결과&nbsp;</p>
          <Skeleton className="h-4 w-4" />
          <p className="text-content">&nbsp;건</p>
        </div>

        <div className="text-content flex cursor-pointer items-center gap-0.5 text-xs opacity-50">
          <p>날짜 순</p>
          <div>
            <ChevronDown size={12} />
          </div>
        </div>
      </div>
      <Skeleton className="h-[188px] w-full" />
      <Skeleton className="h-[188px] w-full" />
      <Skeleton className="h-[188px] w-full" />
    </div>
  );
}
