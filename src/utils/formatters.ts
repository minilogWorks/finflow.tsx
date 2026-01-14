export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  // Map currencies to their appropriate locales for better symbol display
  const localeMap: Record<string, string> = {
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    CAD: "en-CA",
    AUD: "en-AU",
    JPY: "ja-JP",
    GHS: "en-GH",
    NGN: "en-NG",
    ZAR: "en-ZA",
    KES: "en-KE",
    EGP: "ar-EG",
    INR: "en-IN",
    CNY: "zh-CN",
    CHF: "de-CH",
    NZD: "en-NZ",
    SEK: "sv-SE",
    NOK: "nb-NO",
    DKK: "da-DK",
    SGD: "en-SG",
    HKD: "zh-HK",
    MXN: "es-MX",
    BRL: "pt-BR",
  };

  const locale = localeMap[currency] || "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  if (checkDate.getTime() === today.getTime()) {
    return "Today";
  } else if (checkDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  }
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    Food: "utensils",
    Transport: "car",
    Tithe: "heart",
    Utilities: "zap",
    Shopping: "shopping-bag",
    Spotify: "music",
    Healthcare: "heart-pulse",
    Groceries: "shopping-cart",
    "Other Expenses": "more-horizontal",
    Salary: "briefcase",
    Freelance: "laptop",
    Investment: "trending-up",
    Gift: "gift",
    "Spotify-IN": "music",
    "Other Income": "more-horizontal",
    Housing: "home",
    Entertainment: "gamepad-2",
    Education: "book-open",
    Travel: "plane",
    Insurance: "shield",
    default: "receipt",
  };
  return iconMap[categoryName] || iconMap.default;
};

export const getCategoryColor = (categoryName: string): string => {
  const colorMap: Record<string, string> = {
    Food: "#FF6B6B",
    Transport: "#4ECDC4",
    Tithe: "#45B7D1",
    Utilities: "#96CEB4",
    Shopping: "#A29BFE",
    Spotify: "#1DB954",
    Healthcare: "#FF7675",
    Groceries: "#FDCB6E",
    "Other Expenses": "#636E72",
    Salary: "#00B894",
    Freelance: "#0984E3",
    Investment: "#6C5CE7",
    Gift: "#E84393",
    "Spotify-IN": "#1DB954",
    "Other Income": "#00CEC9",
    Housing: "#f72585",
    Entertainment: "#9c27b0",
    Education: "#FF9800",
    Travel: "#2196F3",
    Insurance: "#FF5722",
    default: "#6c757d",
  };
  return colorMap[categoryName] || colorMap.default;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
