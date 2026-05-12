// Curated subset of FontAwesome5 "brand" icons (icon names match the FA5 brand glyph set).
// Used by matchBrandIcon to resolve a typed subscription name → a brand glyph + color.
const BRAND_ICONS: { name: string; aliases?: string[]; color: string }[] = [
  { name: "spotify", color: "#1DB954" },
  { name: "youtube", aliases: ["youtubepremium", "youtubemusic"], color: "#FF0000" },
  { name: "twitch", color: "#9146FF" },
  { name: "discord", color: "#5865F2" },
  { name: "slack", color: "#4A154B" },
  { name: "github", aliases: ["githubpro", "githubcopilot"], color: "#181717" },
  { name: "gitlab", color: "#FC6D26" },
  { name: "bitbucket", color: "#2684FF" },
  { name: "git", color: "#F05032" },
  { name: "docker", color: "#2496ED" },
  { name: "npm", color: "#CB3837" },
  { name: "node", aliases: ["nodejs"], color: "#339933" },
  { name: "react", aliases: ["reactjs"], color: "#61DAFB" },
  { name: "angular", color: "#DD0031" },
  { name: "vuejs", aliases: ["vue"], color: "#41B883" },
  { name: "python", color: "#3776AB" },
  { name: "java", color: "#007396" },
  { name: "js", aliases: ["javascript"], color: "#F7DF1E" },
  { name: "php", color: "#777BB4" },
  { name: "swift", color: "#FA7343" },
  { name: "rust", color: "#000000" },
  { name: "html5", aliases: ["html"], color: "#E34F26" },
  { name: "css3", aliases: ["css"], color: "#1572B6" },
  { name: "sass", color: "#CC6699" },
  { name: "less", color: "#1D365D" },
  { name: "wordpress", color: "#21759B" },
  { name: "drupal", color: "#0678BE" },
  { name: "joomla", color: "#5091CD" },
  { name: "shopify", color: "#7AB55C" },
  { name: "magento", color: "#EE672F" },
  { name: "stripe", aliases: ["stripepayments"], color: "#635BFF" },
  { name: "paypal", aliases: ["paypalpro"], color: "#00457C" },
  { name: "cc-visa", aliases: ["visa"], color: "#1A1F71" },
  { name: "cc-mastercard", aliases: ["mastercard"], color: "#EB001B" },
  { name: "cc-amex", aliases: ["amex", "americanexpress"], color: "#2E77BB" },
  { name: "cc-discover", aliases: ["discover"], color: "#FF6000" },
  { name: "cc-jcb", aliases: ["jcb"], color: "#0E4C96" },
  { name: "cc-stripe", color: "#635BFF" },
  { name: "cc-paypal", color: "#00457C" },
  { name: "bitcoin", aliases: ["btc"], color: "#F7931A" },
  { name: "ethereum", aliases: ["eth"], color: "#3C3C3D" },
  { name: "facebook", aliases: ["facebookpro", "meta"], color: "#1877F2" },
  { name: "facebook-f", color: "#1877F2" },
  { name: "facebook-messenger", aliases: ["messenger"], color: "#0084FF" },
  { name: "instagram", color: "#E4405F" },
  { name: "twitter", color: "#1DA1F2" },
  { name: "tiktok", color: "#000000" },
  { name: "snapchat", color: "#FFFC00" },
  { name: "pinterest", color: "#BD081C" },
  { name: "reddit", color: "#FF4500" },
  { name: "tumblr", color: "#36465D" },
  { name: "linkedin", color: "#0A66C2" },
  { name: "whatsapp", color: "#25D366" },
  { name: "telegram", color: "#26A5E4" },
  { name: "weibo", color: "#E6162D" },
  { name: "line", color: "#00C300" },
  { name: "viber", color: "#665CAC" },
  { name: "mastodon", color: "#6364FF" },
  { name: "vimeo", aliases: ["vimeopro"], color: "#1AB7EA" },
  { name: "dailymotion", color: "#0066DC" },
  { name: "imdb", color: "#F5C518" },
  { name: "soundcloud", color: "#FF5500" },
  { name: "deezer", color: "#FEAA2D" },
  { name: "lastfm", aliases: ["lastdotfm"], color: "#D51007" },
  { name: "napster", color: "#000000" },
  { name: "mixcloud", color: "#52AAD8" },
  { name: "bandcamp", color: "#629AA9" },
  { name: "audible", color: "#F8991C" },
  { name: "google", aliases: ["googleone"], color: "#4285F4" },
  { name: "google-drive", aliases: ["gdrive", "drive"], color: "#1FA463" },
  { name: "google-play", aliases: ["playstore"], color: "#34A853" },
  { name: "google-pay", aliases: ["gpay"], color: "#5F6368" },
  { name: "google-plus", color: "#DB4437" },
  { name: "apple", aliases: ["appleone", "appletv", "applemusic", "iphone"], color: "#000000" },
  { name: "apple-pay", color: "#000000" },
  { name: "app-store", aliases: ["appstore"], color: "#0D96F6" },
  { name: "app-store-ios", color: "#0D96F6" },
  { name: "itunes", color: "#FB5BC5" },
  { name: "itunes-note", color: "#FB5BC5" },
  { name: "android", color: "#3DDC84" },
  { name: "microsoft", aliases: ["msoffice", "microsoft365", "office365"], color: "#5E5E5E" },
  { name: "windows", color: "#0078D4" },
  { name: "xbox", aliases: ["xboxlive", "xboxgamepass", "gamepass"], color: "#107C10" },
  { name: "playstation", aliases: ["ps", "psplus", "psn"], color: "#003791" },
  { name: "steam", aliases: ["steamdeck"], color: "#000000" },
  { name: "steam-symbol", color: "#000000" },
  { name: "amazon", aliases: ["prime", "amazonprime"], color: "#FF9900" },
  { name: "amazon-pay", color: "#FF9900" },
  { name: "aws", aliases: ["amazonwebservices"], color: "#FF9900" },
  { name: "dropbox", color: "#0061FF" },
  { name: "figma", aliases: ["figmapro"], color: "#F24E1E" },
  { name: "behance", color: "#1769FF" },
  { name: "dribbble", color: "#EA4C89" },
  { name: "medium", aliases: ["mediumpartner"], color: "#000000" },
  { name: "stack-overflow", aliases: ["stackoverflow"], color: "#F58025" },
  { name: "stack-exchange", color: "#1E5397" },
  { name: "atlassian", color: "#0052CC" },
  { name: "jira", color: "#0052CC" },
  { name: "trello", color: "#0079BF" },
  { name: "confluence", color: "#172B4D" },
  { name: "bitbucket", color: "#2684FF" },
  { name: "hubspot", color: "#FF7A59" },
  { name: "salesforce", color: "#00A1E0" },
  { name: "intercom", color: "#1F8DED" },
  { name: "zhihu", color: "#0084FF" },
  { name: "mailchimp", color: "#FFE01B" },
  { name: "evernote", color: "#00A82D" },
  { name: "etsy", color: "#F16521" },
  { name: "ebay", color: "#E53238" },
  { name: "airbnb", color: "#FF5A5F" },
  { name: "uber", color: "#000000" },
  { name: "lyft", color: "#FF00BF" },
  { name: "fedex", color: "#4D148C" },
  { name: "ups", color: "#351C15" },
  { name: "usps", color: "#004B87" },
  { name: "dhl", color: "#FFCC00" },
  { name: "yelp", color: "#D32323" },
  { name: "tripadvisor", color: "#34E0A1" },
  { name: "foursquare", color: "#F94877" },
  { name: "waze", color: "#33CCFF" },
  { name: "strava", color: "#FC4C02" },
  { name: "chrome", color: "#4285F4" },
  { name: "firefox", color: "#FF7139" },
  { name: "firefox-browser", color: "#FF7139" },
  { name: "safari", color: "#006CFF" },
  { name: "edge", color: "#0078D7" },
  { name: "internet-explorer", color: "#1EBBEE" },
  { name: "opera", color: "#FF1B2D" },
  { name: "ubuntu", color: "#E95420" },
  { name: "linux", color: "#FCC624" },
  { name: "fedora", color: "#294172" },
  { name: "redhat", aliases: ["rhel"], color: "#EE0000" },
  { name: "centos", color: "#262577" },
  { name: "suse", color: "#0C322C" },
  { name: "raspberry-pi", color: "#A22846" },
  { name: "unity", color: "#000000" },
  { name: "kickstarter", color: "#05CE78" },
  { name: "patreon", color: "#FF424D" },
  { name: "buffer", color: "#168EEA" },
  { name: "blogger", color: "#FF5722" },
  { name: "squarespace", color: "#000000" },
  { name: "wix", color: "#FAAD4D" },
  { name: "elementor", color: "#92003B" },
  { name: "weebly", color: "#1976D2" },
  { name: "dev", aliases: ["devto"], color: "#0A0A0A" },
  { name: "codepen", color: "#000000" },
  { name: "jsfiddle", color: "#4679A4" },
  { name: "stripe-s", color: "#635BFF" },
  { name: "kaggle", color: "#20BEFF" },
  { name: "deviantart", color: "#05CC47" },
  { name: "flickr", color: "#FF0084" },
  { name: "tumblr", color: "#36465D" },
  { name: "quora", color: "#B92B27" },
  { name: "stumbleupon", color: "#EB4924" },
  { name: "delicious", color: "#3399FF" },
  { name: "digg", color: "#005BE2" },
  { name: "skype", color: "#00AFF0" },
  { name: "vk", color: "#0077FF" },
  { name: "yandex", color: "#FF0000" },
  { name: "yandex-international", color: "#FF0000" },
  { name: "yahoo", color: "#6001D2" },
  { name: "qq", color: "#EB1923" },
  { name: "weixin", color: "#07C160" },
  { name: "alipay", color: "#1677FF" },
  { name: "tencent-weibo", color: "#1DA1F2" },
];

const ALIAS_OVERRIDES: Record<string, string> = {
  // Aliases that point at an icon NOT also matching their normalized name.
  // Local-icon aliases for terms commonly typed but whose FA glyph differs.
  // (Used only as a last-resort hint before substring matching.)
  copilot: "github",
  vscode: "microsoft",
  outlook: "microsoft",
  excel: "microsoft",
  word: "microsoft",
  onedrive: "microsoft",
  teams: "microsoft",
  skype: "skype",
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export type BrandIconMatch = {
  name: string;
  color: string;
};

export const matchBrandIcon = (input: string): BrandIconMatch | null => {
  const normalized = normalize(input);
  if (!normalized) return null;

  // 1) Exact match on canonical names or aliases.
  for (const entry of BRAND_ICONS) {
    if (normalize(entry.name) === normalized) {
      return { name: entry.name, color: entry.color };
    }
    if (entry.aliases?.some((alias) => normalize(alias) === normalized)) {
      return { name: entry.name, color: entry.color };
    }
  }

  // 2) Alias override hint (e.g. "vscode" → microsoft).
  const overrideName = ALIAS_OVERRIDES[normalized];
  if (overrideName) {
    const overrideEntry = BRAND_ICONS.find((b) => b.name === overrideName);
    if (overrideEntry) {
      return { name: overrideEntry.name, color: overrideEntry.color };
    }
  }

  // 3) Substring match (input contains canonical/alias, or vice versa).
  //    Require ≥3 chars on both sides to avoid spurious hits.
  if (normalized.length >= 3) {
    for (const entry of BRAND_ICONS) {
      const candidates = [entry.name, ...(entry.aliases ?? [])].map(normalize);
      for (const cand of candidates) {
        if (cand.length < 3) continue;
        if (normalized.includes(cand) || cand.includes(normalized)) {
          return { name: entry.name, color: entry.color };
        }
      }
    }
  }

  return null;
};
