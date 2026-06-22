import PostSideBar from "@/components/post/PostSideBar";
import { createClient } from "@/utils/supabase/server";

export default async function CategoryLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="posts-area mt-1 flex w-full flex-1 gap-6 p-6 pt-0 max-sm:p-0">
      <PostSideBar userId={user?.id} />
      {children}
    </div>
  );
}
