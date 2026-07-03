import Skeleton from "@/components/common/Skeleton";

export default function Search() {
  return (
    <>
      {/* SearchIntro */}
      <div className="flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center gap-4 py-8">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-6 w-110" />

        {/* SearchBar */}
        <Skeleton className="h-38 w-170" />

        {/* SearchRecommend */}
        {/* <Skeleton className="h-30 w-170" /> */}
      </div>
    </>
  );
}
