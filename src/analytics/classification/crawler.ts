import { isBotUserAgent } from "./bot";

const CRAWLER_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /duckduckbot/i,
  /yandexbot/i,
  /baiduspider/i,
  /slurp/i,
  /petalbot/i,
  /applebot/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /mj12bot/i,
];

const PREVIEW_PATTERNS = [
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /slackbot/i,
  /embedly/i,
];

export function classifyTraffic(userAgent: string) {
  if (!userAgent) {
    return "unknown" as const;
  }

  if (PREVIEW_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return "preview" as const;
  }

  if (CRAWLER_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return "crawler" as const;
  }

  if (isBotUserAgent(userAgent)) {
    return "bot" as const;
  }

  return "human" as const;
}
