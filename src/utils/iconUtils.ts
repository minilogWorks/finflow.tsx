import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

const iconMap: Record<string, keyof typeof LucideIcons> = {
  // Dashboard icons
  "pie-chart": "PieChart",
  home: "Home",
  history: "History",
  tags: "Tags",
  "bar-chart": "BarChart",
  user: "User",

  // Category icons
  utensils: "Utensils",
  car: "Car",
  heart: "Heart",
  zap: "Zap",
  "shopping-bag": "ShoppingBag",
  music: "Music",
  "heart-pulse": "HeartPulse",
  "shopping-cart": "ShoppingCart",
  "more-horizontal": "MoreHorizontal",
  briefcase: "Briefcase",
  laptop: "Laptop",
  "trending-up": "TrendingUp", // KEEP ONLY THIS ONE
  gift: "Gift",
  "gamepad-2": "Gamepad2",
  "book-open": "BookOpen",
  plane: "Plane",
  shield: "Shield",

  // Transaction icons
  "arrow-down-right": "ArrowDownRight",
  "arrow-up-right": "ArrowUpRight",
  wallet: "Wallet",
  target: "Target",
  "chevron-right": "ChevronRight",
  info: "Info",
  download: "Download",
  filter: "Filter",
  plus: "Plus",
  edit: "Edit",
  "trash-2": "Trash2",
  receipt: "Receipt",

  // Modal & Notification icons
  "check-circle": "CheckCircle",
  "alert-circle": "AlertCircle",
  x: "X",
  "refresh-cw": "RefreshCw",
};

export const getLucideIcon = (iconName: string): LucideIcon => {
  const mappedName = iconMap[iconName.toLowerCase()] || "Receipt";
  return LucideIcons[mappedName] as LucideIcon;
};
