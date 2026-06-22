"use client";

import { PanelsLeftBottomIcon, Search, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { SearchBarProps } from "@/types/search";
import SearchRecommend from "./SearchRecommend";
import ResponsiveContainer from "../common/ResponsiveContainer";

export default function SearchBar({ searchType, isSearched, TopData }: SearchBarProps) {
  const route = useRouter();
  const [query, setQuery] = useState("");
  const queryChange = useSearchParams();
  const q = queryChange.get("query") ?? "";

  // 검색 버튼 - 제출로 인한 이동
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (!q) route.push(`/search/${searchType}?query=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    if (q !== query) setQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryChange]);

  // 실시간 이동
  useEffect(() => {
    if (!query.trim()) return;

    if (q) {
      const timer = setTimeout(() => {
        route.replace(`/search/${searchType}?query=${encodeURIComponent(query)}`);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [query, route]);

  return (
    <>
      <ResponsiveContainer className="flex w-full flex-col gap-3 border-0 px-5 md:p-6 lg:border">
        <div className="flex items-start gap-3">
          <Button
            variant={searchType === "post" ? "primary" : "tertiary"}
            className="min-h-[30px] min-w-[98px] px-3 py-2 text-xs"
            onClick={() => route.push(`/search/post?query=${query}`)}
          >
            <PanelsLeftBottomIcon size={12} />
            게시물 검색
          </Button>
          <Button
            variant={searchType === "user" ? "primary" : "tertiary"}
            className="min-h-[30px] min-w-[98px] px-3 py-2 text-xs"
            onClick={() => route.push(`/search/user?query=${query}`)}
          >
            <User size={12} />
            사용자 검색
          </Button>
        </div>
        <form className="border-border-main flex h-14 w-full rounded-lg border" onSubmit={handleSearch}>
          <input
            maxLength={30}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="검색어를 입력해주세요..."
            className="w-full pl-3 outline-none"
          />
          <Button type="submit" variant="primary" className="m-2 mr-5 min-h-10 min-w-10 px-3 py-2 text-xs md:mr-3">
            <Search size={16} color="white" />
          </Button>
        </form>
      </ResponsiveContainer>
      <div>
        {!isSearched && searchType === "post" && (
          <SearchRecommend TopData={TopData} query={query} setQuery={setQuery} />
        )}
      </div>
    </>
  );
}
