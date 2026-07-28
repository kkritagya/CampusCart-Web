import { expect, test } from "@playwright/test";

test.describe("public CampusCart experience", () => {
  test("homepage presents the primary marketplace actions", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Smart Buying & Selling for Students" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Sell Now" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Shop by Category" }))
      .toBeVisible();
    await expect(page.getByRole("heading", { name: "Featured Listings" }))
      .toBeVisible();
  });

  test("homepage search sends the query to the marketplace", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("textbox", { name: "Search marketplace" })
      .fill("laptop");
    await page.getByRole("button", { name: "Search" }).click();

    await expect(page).toHaveURL(/\/marketplace\?search=laptop/);
    await expect(page.getByRole("searchbox")).toHaveValue("laptop");
  });

  test("desktop navigation opens the marketplace", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"), "Desktop-only behavior");
    await page.goto("/");
    await page.getByRole("link", { name: "Marketplace" }).first().click();

    await expect(page).toHaveURL(/\/marketplace/);
    await expect(
      page.getByRole("heading", { name: "Marketplace", level: 1 })
    ).toBeVisible();
  });

  test("login form exposes accessible account controls", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Login to CampusCart" }))
      .toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("registration form is available to new users", async ({ page }) => {
    await page.goto("/register");

    await expect(page.getByRole("heading", { name: "Join CampusCart" }))
      .toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /create account|register/i }))
      .toBeVisible();
  });
});

test.describe("responsive navigation", () => {
  test("mobile header uses its compact navigation control", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only behavior");
    await page.goto("/");

    const menu = page.getByRole("button", { name: "Toggle navigation" });
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("navigation", { name: "Primary navigation" }))
      .toBeHidden();
  });
});
