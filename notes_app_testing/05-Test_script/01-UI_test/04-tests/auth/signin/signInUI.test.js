import { test, expect } from "@playwright/test";
import { SignInPage } from "../../../01-POM/auth/signinpage.js";
import { SignUpPage } from "../../../01-POM/auth/signuppage.js";
import { verifyallFieldsCorrect } from "../../../03-helpers/allFieldsFormHelper.js";

test.describe("Verification Sign in page UI", () => {
    let signInPage;

    test.beforeEach(async({page}) => {
        signInPage = new SignInPage(page);
        await signInPage.goto();
    });

    test("TC_UI_13: Sign in page title visible", async () => {
        await expect(signInPage.pageTitle).toBeVisible();
    });

    test("TC_UI_14: All Sign in form fields and elements displayed correctly", async () => {
        await test.step("Check all fields in sign in form", async () => {
            const expectedName = ["Email:", "Password:"];
            await verifyallFieldsCorrect(signInPage, expectedName);
        });

        await test.step("Check other elements of sign in form", async () => {
            await expect(signInPage.signInButton).toBeVisible();
        });
    });

    test("TC_UI_15: 'Don't Have an Account?' text displayed and Register link navigates to Sign up page", async({page}) => {
        const direction = signInPage.registerDirection;
        const link = signInPage.formRegisterLink;

        await expect(direction).toHaveText("Don't Have an Account? Register");
        await expect(direction).toBeVisible();

        await expect(link).toHaveText("Register");
        await expect(link).toBeVisible();
        await signInPage.clickFormRegisterLink();

        await expect(page).toHaveURL("auth/signup");
        const signUpPage = new SignUpPage(page);
        await expect(signUpPage.pageTitle).toBeVisible();
    });
});