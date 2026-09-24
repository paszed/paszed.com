import { chromium } from "@playwright/test";

const baseUrl = "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(5000);
page.setDefaultNavigationTimeout(10000);

const events = [];
const failures = [];
const pending = new Set();

page.on("request", (request) => {
  if (new URL(request.url()).pathname !== "/api/analytics") return;
  const event = request.postDataJSON();
  events.push({ type: event.type, path: event.path, id: event.id });
  pending.add(event.id);
});

page.on("requestfailed", (request) => {
  if (new URL(request.url()).pathname !== "/api/analytics") return;
  failures.push(`Request failed: ${request.failure()?.errorText}`);
  pending.delete(request.postDataJSON().id);
});

page.on("response", (response) => {
  if (new URL(response.url()).pathname !== "/api/analytics") return;
  pending.delete(response.request().postDataJSON().id);
  if (!response.ok()) failures.push(`Analytics HTTP ${response.status()}`);
});

function assertCount(type, path, expected) {
  const actual = events.filter(
    (event) => event.type === type && event.path === path,
  ).length;
  if (actual !== expected) {
    failures.push(`${type} ${path}: expected ${expected}, received ${actual}`);
  }
}

try {
  console.log("Loading /en");
  await page.goto(`${baseUrl}/en`);
  await page.waitForTimeout(1500);

  const links = await page.locator("a").evaluateAll((elements) =>
    elements.map((element) => ({
      href: element.getAttribute("href"),
      path: new URL(element.href).pathname,
    })),
  );

  const about = links.find((link) => link.path === "/about");
  if (!about) throw new Error(`No About link found: ${JSON.stringify(links)}`);

  console.log(`Navigating through ${about.href}`);
  await page.locator("a").filter({ has: page.locator("span") }).count();
  await page.locator("a").evaluateAll((elements) => {
    const link = elements.find(
      (element) => new URL(element.href).pathname === "/about",
    );
    if (!link) throw new Error("About link disappeared");
    link.setAttribute("data-analytics-smoke", "about");
  });

  await page.locator("[data-analytics-smoke=\"about\"]").click();
  await page.waitForURL(`${baseUrl}/about`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);

  assertCount("session_start", "/en", 1);
  assertCount("page_view", "/en", 1);
  assertCount("page_view", "/about", 1);

  const transitions = events.filter(
    (event) => event.type === "route_transition" && event.path === "/about",
  ).length;
  const resumes = events.filter(
    (event) => event.type === "session_resume" && event.path === "/about",
  ).length;

  if (transitions + resumes !== 1) {
    failures.push(
      `Expected one route_transition or session_resume on /about; received ${transitions} transitions and ${resumes} resumes`,
    );
  }

  if (pending.size) failures.push(`${pending.size} requests still pending`);
  console.log(JSON.stringify({ events, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
