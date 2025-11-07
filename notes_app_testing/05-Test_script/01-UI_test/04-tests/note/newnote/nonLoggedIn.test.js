import { test, expect } from "@playwright/test";
import { NewNotePage } from "../../../01-POM/note/newnotepage.js";
import { SignInPage } from "../../../01-POM/auth/signinpage.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";

test("TC_UI_19.05: Note creation fails - non-logged-in user", async ({page}) => {
    const newNotePage = new NewNotePage(page);
    await newNotePage.goto();
    const signInPage = new SignInPage(page);

    await test.step("Check redirected to correct URL", async () => {
        await expect(page).toHaveURL("/auth/signin");
        await expect(signInPage.pageTitle).toBeVisible();
    })

    await test.step("Check error message", async () => {
        await verifyMessageContent(signInPage, ["Not Authorized."]);
    });

});