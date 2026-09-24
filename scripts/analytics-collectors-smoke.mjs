import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const events = [];
const failures = [];
const pending = new Set();

page.on("request", (request) => {
  if (new URL(request.url()).pathname !== "/api/analytics") return;
  try {
    const raw = request.postData();
    if (!raw) {
      failures.push("Analytics request has no readable body");
      return;
    }
    const event = JSON.parse(raw);
    events.push({ type: event.type, path: event.path, id: event.id });
    pending.add(event.id);
  } catch (error) {
    failures.push(`Invalid request body: ${String(error)}`);
  }
});

page.on("response", (response) => {
  if (new URL(response.url()).pathname !== "/api/analytics") return;
  try {
    const raw = response.request().postData();
    if (raw) pending.delete(JSON.parse(raw).id);
  } catch {
    failures.push("Cannot identify analytics response");
  }
  if (!response.ok()) failures.push(`Analytics HTTP ${response.status()}`);
});

page.on("requestfailed", (request) => {
  if (new URL(request.url()).pathname !== "/api/analytics") return;
  failures.push(`Analytics request failed: ${request.failure()?.errorText}`);
});

function requireEvent(type) {
  if (!events.some((event) => event.type === type)) {
    failures.push(`Missing ${type}`);
  }
}

try {
  console.log("Loading production page");
  await page.goto("http://localhost:3000/en");
  await page.locator("body").click({ position: { x: 10, y: 10 } });

  console.log("Testing scroll collector");
  await page.evaluate(() => {
    const spacer = document.createElement("div");
    spacer.style.height = "5000px";
    spacer.setAttribute("data-analytics-smoke-spacer", "true");
    document.body.appendChild(spacer);
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForTimeout(1000);

  console.log("Testing discovery observer");
  await page.evaluate(() => {
    const element = document.createElement("div");
    element.dataset.analyticsDiscovery = "smoke.discovery";
    element.dataset.analyticsDiscoveryType = "capability_discovery";
    element.style.cssText = "position:fixed;top:100px;left:100px;width:200px;height:100px;z-index:99999;";
    document.body.appendChild(element);
  });
  await page.waitForTimeout(1000);

  console.log("Testing visibility and focus");
  await page.evaluate(() => {
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("focus"));
    window.dispatchEvent(new Event("blur"));
  });

  console.log("Waiting for dwell and heartbeat (32 seconds)");
  await page.waitForTimeout(32000);

  requireEvent("scroll");
  requireEvent("scroll_depth");
  requireEvent("capability_discovery");
  requireEvent("visibility_change");
  requireEvent("focus");
  requireEvent("blur");
  requireEvent("dwell");
  requireEvent("heartbeat");

  console.log("Testing exit beacon");
  await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
  await page.waitForTimeout(1500);
  requireEvent("exit");

  if (pending.size) failures.push(`${pending.size} analytics requests pending`);
  console.log(JSON.stringify({ events, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
