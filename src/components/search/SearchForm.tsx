import { cva } from "class-variance-authority";
import { createClient } from "@/utils/supabase/server";
import SearchBar from "./SearchBar";
import SearchIntro from "./SearchIntro";
import SearchResult from "./SearchResult";

const searchFormVariants = cva("flex flex-col gap-4 w-full max-w-[697px] overflow-x-hidden", {
  variants: {
    searched: {
      true: "w-screen max-w-none mx-6 mt-5",
      false:
        "mx-auto items-center justify-center min-h-[calc(100vh-64px)] sm:px-6 md:px-0 sm:-translate-y-10 md:translate-y-0",
    },
  },
  defaultVariants: {
    searched: false,
  },
});

export default async function SearchForm({
  searchType,
  queryParam,
}: {
  searchType: string;
  queryParam: string | null;
}) {
  const isSearched = !!queryParam;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_top_keyword"); // SearchBar에 전달할 인기 검색어 목록
  const TopData = data ?? [];
  if (error) {
    console.error("Error:", error.message);
    return (
      <div className="flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center gap-4 py-8">
        훈수를 찾는 중에 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div className={searchFormVariants({ searched: isSearched })}>
      {!isSearched && <SearchIntro />}

      <SearchBar searchType={searchType} isSearched={isSearched} TopData={TopData} />

      {isSearched && <SearchResult searchType={searchType} queryParam={queryParam} />}
    </div>
  );
}
