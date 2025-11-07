import { test, expect } from "@playwright/test";
import { SignInPage } from "../../../01-POM/auth/signinpage";
import { AllNotesPage } from "../../../01-POM/note/allnotespage";
import { signInData } from "../../../../data/signin_data.js";
import { verifyAllNotesPageLoaded } from "../../../03-helpers/allNotesPageLoadedHelper.js";

test.describe("Submit valid sign in form", () => {
    let signInPage;
    test.beforeEach(async ({page}) => {
        signInPage = new SignInPage(page);
        await signInPage.goto();
    });

    for(const input of signInData.valid) {
        test(input.name, async ({page}) => {
            await signInPage.fillForm(input.data);
            await signInPage.clickSignInButton();

            await test.step("Check redirected to correct URL", async () => {
                await expect(page).toHaveURL("/notes");
                const allNotesPage = new AllNotesPage(page);
                await verifyAllNotesPageLoaded(allNotesPage);
            });
        });
    }
});