import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "lighthouserc.cjs",
    "scripts/analytics-smoke.mjs",
    "scripts/analytics-*-smoke.mjs",
  ],
};

export default config;
