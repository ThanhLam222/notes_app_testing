import { test, expect } from "@playwright/test";
import { IndexPage } from "../01-POM/index/indexpage.js";

test.describe("Verification 404 page UI", () => {
    let pageTitle;

    test.beforeEach(async ({ page }) => {
        await page.goto("/users/notes");
        pageTitle = page.getByRole('heading', {name: "Not Found"});
    });
    
    test("TC_UI_36.01: 404 page title displayed correctly", async () => {
        await expect(pageTitle).toBeVisible();
    });

    test("TC_UI_36.02: 404 page content displayed correctly", async ({ page }) => {
        const pageContent = page.locator('p');

        await test.step("Check content visible and text", async () => {
            await expect(pageContent).toBeVisible();
            await expect(pageContent).toHaveText("This page does not exists");
        });

        await test.step("Check position of content", async () => {
            const titleBox = await pageTitle.boundingBox();
            const contentBox = await pageContent.boundingBox();

            expect(contentBox.y).toBeGreaterThan(titleBox.y + titleBox.height);
        });
    });

    test.describe("CTA button", () => {

        test("TC_UI_36.03.01: 404 page CTA button displayed correctly", async ( { page }) => {
            const CTAButton = page.getByRole('link', {name: "Return to home"});
            await expect(CTAButton).toBeVisible();
        });

        test("TC_UI_36.03.02: 404 page CTA button redirects correctly", async ({ page }) => {
            const CTAButton = page.getByRole('link', {name: "Return to home"});
            await CTAButton.click();

            await expect(page).toHaveURL("/");
            const indexPage = new IndexPage(page);
            await expect(indexPage.pageTitle).toBeVisible();
        });
    });
});