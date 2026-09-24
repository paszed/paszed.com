import { expect, test } from "@playwright/test";

const routes = [
  "/", "/about", "/contact", "/projects", "/specs",
  "/de", "/de/about", "/de/contact", "/de/projects", "/de/specs",
  "/hu", "/hu/about", "/hu/contact", "/hu/projects", "/hu/specs",
];

for (const route of routes) {
  test(`${route} renders its page structure`, async ({ page }) => {
    const response = await page.goto(route);

    expect(response?.ok()).toBe(true);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });
}
