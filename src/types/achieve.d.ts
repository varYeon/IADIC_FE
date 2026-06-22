type BadgeAchieveType = {
  newExp: number;
  newLevel: number;
  leveledUp: boolean;
  badgeName: string;
  addedExp: number | null;
};

type userBadgeType = {
  title_badge: string | null;
  badge: {
    name: string;
    type: string | null;
    category: {
      name: string;
    } | null;
  } | null;
} | null;
