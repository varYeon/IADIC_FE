"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { getFollowPosts, getPosts } from "@/services/post/post.client";
import { PostCardType } from "@/types";
import { createClient } from "@/utils/supabase/client";
import PostCardButton from "./PostCardButton";
import ResponsiveContainer from "../common/ResponsiveContainer";

export default function PostSideList({ user_id }: { user_id?: string }) {
  const [posts, setPosts] = useState<PostCardType[]>([]);
  const supabase = createClient();

  const params = useParams();
  const category = params.category;

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const targetElRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    const getPost = async () => {
      try {
        setIsLoading(true);
        let data: PostCardType[] | null = null;
        if (!user_id) {
          data = await getPosts(category as string);
        } else {
          data = await getFollowPosts(category as string, user_id);
        }

        if (data && mountedRef.current) {
          setPosts(data);
          setCursor(data[data.length - 1]?.created_at || null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getPost();

    return () => {
      mountedRef.current = false;
    };
  }, [category, user_id]);

  const loadMore = useCallback(async () => {
    if (!mountedRef.current || isLoading || !hasMore) return;
    setIsLoading(true);

    const LIMIT = 10;
    let query = supabase
      .from("posts")
      .select("*,category!inner(id, name, type), profiles(id, name, avatar_image)")
      .order("created_at", { ascending: false })
      .limit(LIMIT);

    if (category !== "all") query = query.eq("category.type", category as string);
    if (user_id) {
      const { data, error } = await supabase.from("follow").select("*").eq("follower_id", user_id);
      if (error) console.error(error);
      const ids = data?.map(item => item.following_id) ?? [];
      query = query.in("user_id", ids);
    }
    if (cursor) query = query.lt("created_at", cursor);

    const { data, error } = await query;
    if (error) {
      console.error(error);
      setIsLoading(false);
      return;
    }

    const newData = data?.filter(d => !posts.find(p => p.id === d.id)) || [];

    if (newData.length > 0) {
      setPosts(prev => [...prev, ...newData]);
      setCursor(newData[newData.length - 1].created_at);
    } else {
      setHasMore(false);
    }

    setIsLoading(false);
  }, [isLoading, hasMore, supabase, category, user_id, cursor, posts]);

  useEffect(() => {
    if (!targetElRef.current || posts.length === 0) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isLoading && hasMore) {
        loadMore();
      }
    });
    observer.observe(targetElRef.current);
    return () => observer.disconnect();
  }, [loadMore, isLoading, hasMore, posts]);

  return (
    <ResponsiveContainer
      className={twMerge(
        "scrollbar-hide flex w-full flex-col gap-4 overflow-y-scroll px-3 py-4.5",
        posts.length === 0 && "flex h-full items-center justify-center"
      )}
    >
      {posts.length !== 0 &&
        posts.map(post => <PostCardButton key={post.id} postData={post} className="max-sm:w-full" />)}

      {!isLoading && posts.length === 0 && <span className="text-text-light text-sm">작성된 게시글이 없습니다.</span>}

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <div className="h-5 w-5 animate-spin rounded-full border border-gray-400 border-t-transparent"></div>
        </div>
      )}

      {!isLoading && hasMore && <div ref={targetElRef} style={{ height: "1px" }} />}
    </ResponsiveContainer>
  );
}
