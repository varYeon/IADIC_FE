import Skeleton from "@/components/common/Skeleton";
import { searchFormVariants } from "@/components/search/SearchForm";

export default function Search() {
  return (
    <>
      {/* SearchIntro */}
      <div className={searchFormVariants({ searched: false })}>
        <Skeleton className="h-8 w-[70%] max-w-60" />
        <Skeleton className="h-6 w-[70%] max-w-110" />

        {/* SearchBar */}
        <Skeleton className="h-38 w-full max-w-170" />

        {/* SearchRecommend */}
        {/* <Skeleton className="h-30 w-170" /> */}
      </div>
    </>
  );
}
