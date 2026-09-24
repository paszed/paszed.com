import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/de", "/hu", "/projects"];

for (const route of routes) {
  test(`${route} has no detected accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole("main")).toHaveCount(1);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
