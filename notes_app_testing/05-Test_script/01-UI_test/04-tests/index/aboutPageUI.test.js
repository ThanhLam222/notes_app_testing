import { test, expect } from "@playwright/test";
import { AboutPage } from "../../01-POM/index/aboutpage.js";

test.describe("Verification About page UI", () => {
    let aboutPage;
    let pageTitle;

    test.beforeEach(async ({ page }) => {
        aboutPage = new AboutPage(page);
        await aboutPage.goto();
        pageTitle = aboutPage.pageTitle;
    });

    test("TC_UI_34: About page title displayed correctly", async () => {
        await expect(pageTitle).toBeVisible();
    });

    test("TC_UI_35: About page paragraph displayed below heading", async () => {
        const paragraph = aboutPage.pageParagraph;
        await test.step("Check paragraph visible", async () => {
            await expect(paragraph).toBeVisible();
        });

        await test.step("Check position of paragraph", async () => {
            const titleBox = await pageTitle.boundingBox();
            const paragraphBox = await paragraph.boundingBox();

            expect(paragraphBox.y).toBeGreaterThan(titleBox.y + titleBox.height);
        });
    });
});