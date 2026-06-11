const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const farcasterConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
  },

  miniapp: {
    version: "1",

    // ✅ APP NAME
    name: "Base Utility Hub",

    // ✅ TAGLINE
    subtitle: "Gas, Prices & Crypto News",

    // ✅ DESCRIPTION
    description:
      "All-in-one Base utility app for gas estimation, crypto prices, and latest crypto news.",

    // ✅ ICON
    iconUrl: `${ROOT_URL}/base-logo.png`,

    // ✅ FIX (VERY IMPORTANT — THIS WAS MISSING)
    heroImageUrl: `${ROOT_URL}/base-logo.png`,

    // ✅ MAIN URL
    homeUrl: ROOT_URL,

    // optional but safe
    webhookUrl: `${ROOT_URL}/api/webhook`,

    primaryCategory: "finance",

    tags: ["base", "crypto", "gas", "prices", "news"],

    tagline: "Track gas, crypto prices & news in one place",

    ogTitle: "Base Utility Hub ⚡",

    ogDescription:
      "Check gas fees, track top crypto prices and stay updated with latest crypto news on Base.",

    ogImageUrl: `${ROOT_URL}/base-logo.png`
  }
} as const;
