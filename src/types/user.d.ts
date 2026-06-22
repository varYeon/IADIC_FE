type UserProfile = {
  avatar_image: string | null;
  bio: string | null;
  created_at: string;
  email: string;
  exp: number | null;
  id: string;
  level: number | null;
  name: string;
  phone_number: string | null;
  title_badge: string | null;
  badge?:
    | (BadgeType & {
        category: {
          name: string;
        } | null;
      })
    | null;
} | null;
