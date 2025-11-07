import { test, expect } from "@playwright/test";
import { SignInPage } from "../../01-POM/auth/signinpage.js";
import { SignUpPage } from "../../01-POM/auth/signuppage.js";
import { logout } from  "../../03-helpers/logoutHelper.js";
import { verifyPositionMessage } from "../../03-helpers/positionMessageHelper.js";
import { verifyCloseButton } from "../../03-helpers/closeMessageHelper.js";
import { verifyAllElementVisible, getElementContent } from "../../03-helpers/allElementsHelper.js"
import { createData } from "../../../data/helpers/createSignup_helper.js";

test.describe("Flash message and multiple error messages", () => {
    test.describe("Flash message", () => {
        let signInPage;
        let message;

        test.describe("Success flash message", () => {
            test.beforeEach(async ({page}) => {
                await logout(page);

                //Ensures user redirected to correct URL and success flash message is visible
                await expect(page).toHaveURL("/auth/signin");
                signInPage = new SignInPage(page);
                message = signInPage.resultPopUp;
                await expect(message).toBeVisible();
                
            });

            test("TC_UI_06.01: Success flash message displayed correctly", async ({page}) => {
                const count = await signInPage.countMessage();

                await test.step("Checks number of message", async () => {
                    expect(count).toEqual(1);
                });

                // Using expect.soft: content can fail but we still want to validate layout
                await test.step("Checks content of message", async () => {
                    await expect.soft(message).toHaveText("You are logged out now.");
                });

                await test.step("Check position of message", async () => {
                    await verifyPositionMessage(message, page, count);
                });
            });

            test("TC_UI_06.02: Close button is active when success flash message appears", async () => {
                await verifyCloseButton(["You are logged out now."], signInPage);
            });
        });

        test.describe("Error flash message", () => {
            test.beforeEach(async ({page}) => {
                signInPage = new SignInPage(page);
                await signInPage.goto();
                
                // Ensures sign in page has been loaded successfully
                await expect (signInPage.pageTitle).toBeVisible();

                // Sends form with all field empty
                await signInPage.clickSignInButton();

                // Ensures user redirected to correct URL and error flash message is visible
                await expect(page).toHaveURL("/auth/signin");
                message = signInPage.resultPopUp;
                await expect(message).toBeVisible();
            });

            test("TC_UI_07.01: Error flash message displayed correctly", async ({page}) => {
                const count = await signInPage.countMessage();
                
                await test.step("Checks number of message", async () => {
                    expect(count).toEqual(1);
                });

                // Using expect.soft: content can fail but we still want to validate layout
                await test.step("Checks content of message", async () => {
                    await expect.soft(message).toHaveText("Missing credentials");
                });

                await test.step("Check position of message", async () => {
                    await verifyPositionMessage(message, page, count);
                });
            });

            test("TC_UI_07.02: Close button is active when error flash message appears", async () => {
                await verifyCloseButton(["Missing credentials"], signInPage);
            });
        });
    });

    test.describe("Multiple error messages", () => {
        let signUpPage;
        let messages;
        const expectedError = ["Passwords do not match.", "Passwords must be at least 4 characters."];

        test.beforeEach(async ({page}) => {
            // Attempt to register with an invalid password and a mismatched confirmation password
            signUpPage = new SignUpPage(page);
            await signUpPage.goto();
            const data = createData({password: "use"});
            await signUpPage.fillForm(data);
            await signUpPage.clickSignUpButton();

            //Ensure user redirected to correct URL and error message is visible
            await expect(page).toHaveURL("/auth/signup");
            messages = signUpPage.resultPopUp;
            await verifyAllElementVisible(messages);
        });

        test("TC_UI_08.01: Multiple error messages displayed correctly", async ({page}) => {
            const count = await signUpPage.countMessage();

            await test.step("Checks number of message", async () => {
                    expect(count).toEqual(2);
            });

            // Using expect.soft: content can fail but we still want to validate layout
            await test.step("Checks content of message", async () => {
                let messageText = await getElementContent(messages);
                expect.soft(messageText).toEqual(expect.arrayContaining(expectedError));
            });

            await test.step("Check position of message", async () => {
                await verifyPositionMessage(messages, page, count);
            });
        });

        test("TC_UI_08.02: Close button is active when error messages (array not flash message) appears", async () => {
            await verifyCloseButton(expectedError, signUpPage);
        });
    });
});