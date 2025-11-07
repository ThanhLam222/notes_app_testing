import { test, expect } from "@playwright/test";
import { IndexPage } from "../../01-POM/index/indexpage.js";
import { SignInPage } from "../../01-POM/auth/signinpage.js";
import { SignUpPage } from "../../01-POM/auth/signuppage.js";

test.describe("Navigation for non-logged in users", () => {
    let indexPage;

    test.beforeEach(async ({page}) => {
        indexPage = new IndexPage(page);
        await indexPage.goto();
    });

    test("TC_UI_04.01: Login link: visible and navigates to the Sign in page - non-logged-in user", async ({page}) => {

        await expect(indexPage.navLoginLink).toBeVisible();

        await indexPage.clickNavLogin();

        await expect(page).toHaveURL("/auth/signin");
        const signInPage = new SignInPage(page);
        await expect(signInPage.pageTitle).toBeVisible();
    });

    test("TC_UI_04.02: Register link: visible and navigates to the Sign up page - non-logged-in user", async ({page}) => { 

        await expect(indexPage.navRegisterLink).toBeVisible();

        await indexPage.clickNavRegister();

        await expect(page).toHaveURL("/auth/signup");
        const signUpPage = new SignUpPage(page);
        await expect(signUpPage.pageTitle).toBeVisible();
    });

    test("TC_UI_04.03: Logged-in dropdown menu not visible for non-logged-in user", async() => {

        await expect(indexPage.dropdownMenu).toHaveCount(0);
        await expect(indexPage.allDropdownItems).toHaveCount(0);
    });   
});
