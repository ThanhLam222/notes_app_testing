import { test, expect } from "@playwright/test";
import { IndexPage } from "../../01-POM/index/indexpage.js";
import { SignUpPage } from "../../01-POM/auth/signuppage.js";

test.describe("Verification Index page UI", () => {
    let indexPage;

    test.beforeEach(async ({ page }) => {
        indexPage = new IndexPage(page);
        await indexPage.goto();
    });

    test("TC_UI_31: Index page title displayed correctly", async () => {
        await expect(indexPage.pageTitle).toBeVisible();
    });

    test("TC_UI_32: Index page shows technologies and purpose info", async () => {
        const appPurpose = indexPage.appPurpose;
        await expect(appPurpose).toBeVisible();
        await expect(appPurpose).toHaveText(
            "A simple App to manage Notes developed with Nodejs, Express, Mongodb and Javascript Technologies");
    });

    test.describe("CTA button", () => {

        test("TC_UI_33.01: Index page CTA button displayed correctly", async () => {
            await expect(indexPage.registerButton).toBeVisible();
        });

        test("TC_UI_33.02: CTA button redirects correctly", async ( { page }) => {
            await indexPage.clickRegisterButton();
            const signUpPage = new SignUpPage(page);

            await expect(page).toHaveURL("/auth/signup");
            await expect(signUpPage.pageTitle).toBeVisible();
        });
    });
});