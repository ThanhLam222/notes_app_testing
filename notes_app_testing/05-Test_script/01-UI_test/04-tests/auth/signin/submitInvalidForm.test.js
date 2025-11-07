import { test, expect } from "@playwright/test";
import { SignInPage } from "../../../01-POM/auth/signinpage.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";
import { signInData } from "../../../../data/signin_data.js";

test.describe("Submit invalid sign in form", () => {
    let signInPage;
    
    test.beforeEach(async ({page}) => {
        signInPage = new SignInPage(page);
        await signInPage.goto();
    });

    test.describe("Throw missing fields error", () => {
        for(const input of signInData.missingFields) {
            test(input.name, async ({page}) => {
                await signInPage.fillForm(input.data);
                await signInPage.clickSignInButton();
                
                await test.step("Check browser to stay in sign in page", async () => {
                    await expect(page).toHaveURL("/auth/signin");
                    await expect(signInPage.pageTitle).toBeVisible();
                });
                
                await test.step("Check field value", async () => {
                    for( const fieldName of Object.keys(input.data)) {
                        expect.soft(await signInPage.getFieldValue(fieldName)).toEqual("");
                    }
                });
                
                await test.step("Check error message", async () => {
                    await verifyMessageContent(signInPage, ["Missing credentials"]);
                });
            });
        }
    });

    test.describe("Throw incorrect password error", () => {
        for(const input of signInData.incorrectPassword) {
            test(input.name, async ({page}) => {
                await signInPage.fillForm(input.data);
                await signInPage.clickSignInButton();
                
                await test.step("Check browser to stay in sign in page", async () => {
                    await expect(page).toHaveURL("/auth/signin");
                    await expect(signInPage.pageTitle).toBeVisible();
                });
                
                await test.step("Check field value", async () => {
                    for( const fieldName of Object.keys(input.data)) {
                        expect.soft(await signInPage.getFieldValue(fieldName)).toEqual("");
                    }
                });
                
                await test.step("Check error message", async () => {
                    await verifyMessageContent(signInPage, ["Incorrect Password."]);
                });
            });
        }
    });

    test.describe("Throw incorrect email error", () => {
        for(const input of signInData.incorrectEmail) {
            test(input.name, async ({page}) => {
                await signInPage.fillForm(input.data);
                await signInPage.clickSignInButton();
                
                await test.step("Check browser to stay in sign in page", async () => {
                    await expect(page).toHaveURL("/auth/signin");
                    await expect(signInPage.pageTitle).toBeVisible();
                });
                
                await test.step("Check field value", async () => {
                    for( const fieldName of Object.keys(input.data)) {
                        expect.soft(await signInPage.getFieldValue(fieldName)).toEqual("");
                    }
                });
                
                await test.step("Check error message", async () => {
                    await verifyMessageContent(signInPage, ["Not User found."]);
                });
            });
        }
    });
});