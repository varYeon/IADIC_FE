import { Post, Profile } from "@/types/search";
import { createClient } from "@/utils/supabase/server";
import SearchResultClient from "./SearchResultClient";

export default async function SearchResult({ searchType, queryParam }: { searchType: string; queryParam: string }) {
  const supabase = await createClient();

  let searchData: Post[] | Profile[] = [];

  if (searchType === "post") {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*, profiles(name), category(type, name)")
      .or(`title.ilike.%${queryParam}%, content.ilike.%${queryParam}%`)
      .order("created_at", { ascending: false });
    searchData = posts || [];
    if (error) {
      console.error("Search error:", error.message);
      return (
        <div className="flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center gap-4 py-8">
          훈수를 찾는 중에 오류가 발생했습니다.
        </div>
      );
    }
  } else {
    const { data: users, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("name", `%${queryParam}%`)
      .order("created_at", { ascending: false });
    searchData = users || [];
    if (error) {
      console.error("Search error:", error.message);
      return (
        <div className="flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center gap-4 py-8">
          훈수자를 찾는 중에 오류가 발생했습니다.
        </div>
      );
    }
  }

  return <SearchResultClient searchType={searchType} searchData={searchData} queryParam={queryParam} />;
}
