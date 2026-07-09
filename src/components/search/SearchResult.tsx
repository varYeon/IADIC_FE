"use client";

import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PostWithProfile, Profile } from "@/types/search";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import ResultPosts from "./ResultPosts";
import SearchResultSkeleton from "./SearchResultSkeleton";
import Badge from "../common/Badge";
import ProfileSlide from "../user/ProfileSlide";

export const cardVariants = cva(
  "flex w-full cursor-pointer justify-between gap-3 rounded-3xl border border-border-main hover:bg-border-main"
);

// TODO 컴포넌트화

export default function SearchResult({ searchType, queryParam }: { searchType: string; queryParam: string }) {
  const {
    data: searchData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: searchType === "post" ? ["posts", queryParam] : ["users", queryParam],
    queryFn: async () => {
      const supabase = createClient();

      if (searchType === "post") {
        const { data: posts, error } = await supabase
          .from("posts")
          .select("*, profiles(name), category(type, name)")
          .or(`title.ilike.%${queryParam}%, content.ilike.%${queryParam}%`)
          .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);

        return posts ?? [];
      } else if (searchType === "user") {
        const { data: users, error } = await supabase
          .from("profiles")
          .select("*")
          .ilike("name", `%${queryParam}%`)
          .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);

        return users || [];
      }

      return [];
    },
    enabled: !!queryParam,
    staleTime: 60 * 1000,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [arrangeType, setArrangeType] = useState("date");
  const [arrangedData, setArrangedData] = useState<PostWithProfile[] | Profile[]>(searchData || []);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";

  useEffect(() => {
    setArrangedData(searchData);
  }, [searchData]);

  const textHighlight = (text: string) => {
    if (!queryParam) return text;
    const parts = text.split(new RegExp(`(${queryParam})`, "gi"));
    return parts.map((part, i) => {
      return part.toLowerCase() === queryParam.toLowerCase() ? (
        <span key={i} className="text-main text-bold">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      );
    });
  };

  const arrangeHandler = (type: string) => {
    setArrangeType(type);
    setIsOpen(!isOpen);

    if (searchType === "post") {
      const newDataPost = [...arrangedData] as PostWithProfile[];
      if (type === "name") {
        newDataPost.sort((a, b) => a.title.localeCompare(b.title ?? ""));
      }
      setArrangedData(newDataPost);
    } else if (searchType === "user") {
      const newDataUser = [...arrangedData] as Profile[];
      if (type === "name") {
        newDataUser.sort((a, b) => a.name.localeCompare(b.name ?? ""));
      }
      setArrangedData(newDataUser);
    }
  };

  // isLoading 스켈레톤
  if (isLoading) return <SearchResultSkeleton />;

  // isError
  if (isError) {
    console.error("Search error:", error.message);

    return (
      <div className="flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center gap-4 py-8">
        훈수자를 찾는 중에 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div className={`flex gap-6 ${searchType === "user" && selectedUser ? "flex-row" : ""}`}>
      {/* 왼쪽 */}
      <div
        className={`md:border-border-main flex flex-col gap-3 rounded-3xl md:border md:p-6 ${searchType === "user" && selectedUser ? "hidden w-2/3 lg:flex" : "flex w-full"} flex-col gap-3`}
      >
        <div className="relative flex justify-between">
          <div className="flex text-xs">
            <p className="text-content">검색 결과&nbsp;</p>
            <p className="text-main">{searchData.length}</p>
            <p className="text-content">건</p>
          </div>
          <button
            className="text-content flex cursor-pointer gap-0.5 text-xs"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <p>{arrangeType === "date" ? "날짜 순" : "이름 순"}</p>
            <div className="cursor-pointer">
              <ChevronDown size={12} />
            </div>
          </button>

          {/* 정렬 드롭 다운 */}
          {isOpen && (
            <div className="text-content bg-bg-main absolute top-full right-0 mt-1 w-17 border border-gray-200 p-3 text-xs">
              <button onClick={() => arrangeHandler("date")} className="mb-3 block w-full cursor-pointer text-center">
                날짜 순
              </button>
              <button onClick={() => arrangeHandler("name")} className="block w-full cursor-pointer text-center">
                이름 순
              </button>
            </div>
          )}
        </div>

        {searchData.length === 0 && (
          <div className="flex h-100 w-full items-center justify-center">
            <p className="text-content">검색 결과가 존재하지 않습니다.</p>
          </div>
        )}

        {searchType === "post" && (
          <ResultPosts searchData={arrangedData as PostWithProfile[]} textHighlight={textHighlight} />
        )}

        {searchType === "user" &&
          (arrangedData as Profile[]).map(user => (
            <div
              key={user.id}
              className={cardVariants()}
              onClick={() => {
                setSelectedUser(user);
                router.replace(`${path}?query=${query}&user=${user.id}`);
              }}
            >
              <div className="flex flex-col gap-12 p-6">
                <p>{textHighlight(user.name)}</p>
                <Badge className="bg-amber-400 px-2 py-1" size="sm" text={`LV.${user.level}`} />
                {/* <Badge size="sm" className="bg-pink-600 px-2 py-1 text-white" text="HOT" /> */}
              </div>
              <div>
                <Image
                  src={user.avatar_image || "/profile_sample.svg"}
                  alt={`${user.name}의 프로필 사진`}
                  width={192}
                  height={192}
                  className="m-1.5 h-48 min-h-48 w-48 min-w-48 rounded-sm md:h-45 md:w-45"
                />
              </div>
            </div>
          ))}
      </div>
      {/* 오른쪽 */}
      {searchType === "user" && selectedUser && (
        <div className="w-full lg:w-1/3">
          <ProfileSlide onClick={() => setSelectedUser(null)} />
        </div>
      )}
    </div>
  );
}
