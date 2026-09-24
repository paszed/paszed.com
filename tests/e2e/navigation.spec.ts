import { expect, test } from "@playwright/test";

test("brand and locale navigation render without React script warnings", async ({ page }) => {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();

  await page.goto("/de");
  await expect(page.locator("main")).toBeVisible();

  await page.getByRole("link", { name: "Paszed home" }).first().click();
  await expect(page).toHaveURL(/\/de\/?$/);
  await expect(page.locator("main")).toBeVisible();

  await page.goto("/en");
  await expect(page.locator("main")).toBeVisible();

  await page.getByRole("link", { name: "Paszed home" }).first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("main")).toBeVisible();

  expect(
    errors.filter((message) =>
      message.includes("Encountered a script tag while rendering React component"),
    ),
  ).toEqual([]);
});

test("language switching renders both locales without React script warnings", async ({ page }) => {
  const scriptWarnings: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.text().includes("Encountered a script tag while rendering React component")) {
      scriptWarnings.push(message.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("main")).toBeVisible();

  const switchTo = async (locale: "en" | "de") => {
    const trigger = page.locator(
      'button[data-analytics-id="preferences.language.menu"]:visible',
    );
    await expect(trigger.locator("..")).toHaveAttribute("data-hydrated", "true");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("menuitem", { name: new RegExp(" " + locale.toUpperCase() + "$") }).click();
  };

  await switchTo("de");
  await expect(page).toHaveURL(/\/de\/?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.locator("main")).toBeVisible();

  await switchTo("en");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("main")).toBeVisible();

  expect(scriptWarnings, "React script warnings").toEqual([]);
  expect(pageErrors, "Uncaught browser errors").toEqual([]);
});

