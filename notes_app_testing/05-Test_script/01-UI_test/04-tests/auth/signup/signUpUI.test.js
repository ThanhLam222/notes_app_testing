import { test, expect } from "@playwright/test";
import { SignUpPage } from "../../../01-POM/auth/signuppage.js";
import { SignInPage } from "../../../01-POM/auth/signinpage.js";
import { verifyallFieldsCorrect } from "../../../03-helpers/allFieldsFormHelper.js";

test.describe("Verification Sign up page UI", () => {
    let signUpPage;

    test.beforeEach(async ({page}) => {
        signUpPage = new SignUpPage(page);
        await signUpPage.goto();
    });

    test("TC_UI_09: Sign up page title visible", async () => {
        await expect(signUpPage.pageTitle).toBeVisible();
    });

    test("TC_UI_10: All Sign up form fields and elements displayed correctly", async () => {
        await test.step("Check all fields in sign up form", async () => {
            const expectedName = ["Name:", "Email:", "Password:", "Confirm Password:"];
            await verifyallFieldsCorrect(signUpPage, expectedName);
        });

        await test.step("Check other elements of sign up form", async () => {
            await expect(signUpPage.signUpButton).toBeVisible();
        });
    });

    test("TC_UI_11: 'Already Have an Account?' text displayed and Login link navigates to Sign in page", async ({page}) => {
        const direction = signUpPage.loginDirection;
        const link = signUpPage.formLoginLink;

        await expect(direction).toHaveText("Already Have an Account? Login");
        await expect(direction).toBeVisible();

        await expect(link).toHaveText("Login");
        await expect(link).toBeVisible();
        await signUpPage.clickFormLoginLink();

        await expect(page).toHaveURL("/auth/signin");
        const signInPage = new SignInPage(page);
        await expect(signInPage.pageTitle).toBeVisible();
    });
});
