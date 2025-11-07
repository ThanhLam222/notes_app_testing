import { test, expect } from "@playwright/test";
import { SignInPage } from "../../../01-POM/auth/signinpage.js";
import { logout } from "../../../03-helpers/logoutHelper.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";

test("TC_UI_29: Logout succeeds - logged-in user", async ({page}) => {
    await logout(page);
    const signInPage = new SignInPage(page);

    await test.step("Check redirected to correct URL", async () => {
        await expect(page).toHaveURL("/auth/signin");
        await expect(signInPage.pageTitle).toBeVisible();
    });

    await test.step("Check success message", async () => {
        await verifyMessageContent(signInPage, ["You are logged out now."]);
    });
});

