import { chromium } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const failures = [];
let sessionId;

try {
  await page.goto("http://localhost:3000/en");
  sessionId = await page.evaluate(() => sessionStorage.getItem("paszed:analytics:session"));
  if (!sessionId) throw new Error("Analytics session ID missing");

  await page.evaluate(() => {
    const element = document.createElement("div");
    element.dataset.analyticsDiscovery = "smoke.discovery";
    element.dataset.analyticsDiscoveryType = "capability_discovery";
    element.style.cssText = "position:fixed;top:100px;left:100px;width:200px;height:100px;z-index:99999;";
    document.body.appendChild(element);
  });

  await page.waitForTimeout(1500);
  await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
  await page.waitForTimeout(1500);

  const { data, error } = await supabase
    .from("analytics_events")
    .select("id,type,path,metadata,occurred_at")
    .eq("session_id", sessionId)
    .in("type", ["capability_discovery", "exit"]);

  if (error) throw error;

  for (const type of ["capability_discovery", "exit"]) {
    if (!data.some((event) => event.type === type)) {
      failures.push(`Missing persisted ${type}`);
    }
  }

  console.log(JSON.stringify({ sessionId, events: data, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
