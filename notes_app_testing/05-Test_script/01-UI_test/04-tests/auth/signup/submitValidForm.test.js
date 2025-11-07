import { test, expect } from "@playwright/test";
import { SignUpPage } from "../../../01-POM/auth/signuppage.js";
import { SignInPage } from "../../../01-POM/auth/signinpage.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";
import { signUpData } from "../../../../data/signup_data.js";

test.describe("Submit valid sign up form", () => {
    let signUpPage;

    test.beforeEach(async ({page}) => {
        signUpPage = new SignUpPage(page);
        await signUpPage.goto();
    });

    for(const input of signUpData.valid) {
        test(input.name, async ({page}) => {
            await signUpPage.fillForm(input.data);
            await signUpPage.clickSignUpButton();
            const signInPage = new SignInPage(page);

            await test.step("Check redirected to correct URL", async () => {
                await expect(page).toHaveURL("/auth/signin");
                await expect(signInPage.pageTitle).toBeVisible();
            });

            await test.step("Check success message", async () => {
                await verifyMessageContent(signInPage, ["You are registered."]);
            });
        });
    }
});


