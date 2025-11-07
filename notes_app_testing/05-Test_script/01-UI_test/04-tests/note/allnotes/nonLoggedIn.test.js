import { test, expect } from "@playwright/test";
import { AllNotesPage } from "../../../01-POM/note/allnotespage.js";
import { SignInPage } from "../../../01-POM/auth/signinpage.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";

test("TC_UI_22: Notes reading fails - non-logged-in user", async ({page}) => {
    const allNotesPage = new AllNotesPage(page);
    await allNotesPage.goto();
    const signInPage = new SignInPage(page);

    await test.step("Check redirected to correct URL", async () => {
        await expect(page).toHaveURL("/auth/signin");
        await expect(signInPage.pageTitle).toBeVisible();
    })

    await test.step("Check error message", async () => {
        await verifyMessageContent(signInPage, ["Not Authorized."]);
    });
});