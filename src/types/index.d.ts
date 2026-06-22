import { Database } from "@/utils/supabase/supabase";

export type CategoryType = Database["public"]["Tables"]["category"]["Row"];
export type BadgeType = Database["public"]["Tables"]["badge"]["Row"];
export type FollowType = Database["public"]["Tables"]["follow"];
export type PostType = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsertType = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdateType = Database["public"]["Tables"]["posts"]["Update"];
export type PostCardType = PostType & {
  category: {
    id: string;
    name: string;
    type: string | null;
  };
  profiles: {
    id: string;
    name: string;
    avatar_image: string | null;
  };
};
export type PostDetailType = Omit<PostType, "category"> & {
  profiles: {
    id: string;
    name: string;
    avatar_image: string;
  };
};
export type CommentType = Database["public"]["Tables"]["comments"]["Row"];
export type CommentInserType = Database["public"]["Tables"]["comments"]["Insert"];
export type CommentDetailType = Omit<
  Database["public"]["Functions"]["get_comment_details"]["Returns"],
  "profiles",
  "reactions"
> & {
  profiles: {
    avatar_image: string;
    name: string;
  };
  reactions: {
    like: { count: number };
    dislike: { count: number };
  };
};

export type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];

export type FormState = {
  success: boolean;
  error: string | null;
  result: BadgeAchieveType[] | null;
};
