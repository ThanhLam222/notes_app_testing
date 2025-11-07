import { test, expect } from "@playwright/test";
import { SignInPage } from "../../../01-POM/auth/signinpage.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";

test("TC_UI_30: Logout fails - non logged-in user", async ({ page }) => {
    await page.goto("/auth/logout");
    const signInPage = new SignInPage(page)

    await test.step("Check redirected to correct URL", async () => {
        await expect(page).toHaveURL("/auth/signin");
        await expect(signInPage.pageTitle).toBeVisible();
    })

    await test.step("Check error messge", async () => {
        await verifyMessageContent(signInPage, ["Not Authorized."]);
    });
});