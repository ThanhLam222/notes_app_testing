import { test, expect } from "@playwright/test";
import { SignUpPage } from "../../../01-POM/auth/signuppage.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";
import { signUpData } from "../../../../data/signup_data.js";

test.describe("Submit invalid sign up form", () => {
   let signUpPage;

    test.beforeEach(async ({page}) => {
        signUpPage = new SignUpPage(page);
        await signUpPage.goto();
    });

    test.describe("Throw missing fields error", () => {
        for(const input of signUpData.missingFields) {
            test(input.name, async({page}) => {
                await signUpPage.fillForm(input.data);
                await signUpPage.clickSignUpButton();

                await test.step("Check browser to stay in sign up page", async () => {
                    await expect(page).toHaveURL("/auth/signup");
                    await expect(signUpPage.pageTitle).toBeVisible();
                });

                await test.step("Check field value", async () => {
                    for(const fieldName of Object.keys(input.data)) {
                        expect.soft(await signUpPage.getFieldValue(fieldName)).toEqual(input.data[fieldName]);
                    }
                });

                await test.step("Check error message", async () => {
                    await verifyMessageContent(
                        signUpPage, ["Please fill out all required fields (email/password/confirm password)."]);
                });
            });
        }
    });

    test.describe("Throw existing email error", () => {
        for(const input of signUpData.existingEmail) {
            test(input.name, async({page}) => {
                await signUpPage.fillForm(input.data);
                await signUpPage.clickSignUpButton();

                await test.step("Check browser to stay in sign up page", async () => {
                    await expect(page).toHaveURL("/auth/signup");
                    await expect(signUpPage.pageTitle).toBeVisible();
                });

                await test.step("Check field value", async () => {
                    for(const fieldName of Object.keys(input.data)) {
                        expect.soft(await signUpPage.getFieldValue(fieldName)).toEqual("");
                    }
                });

                await test.step("Check error message", async () => {
                    await verifyMessageContent(signUpPage, ["The Email is already in use."]);
                });
            });
        }
    });

    test.describe("Throw short password error", () => {
        for(const input of signUpData.shortPassword) {
            test(input.name, async({page}) => {
                await signUpPage.fillForm(input.data);
                await signUpPage.clickSignUpButton();

                await test.step("Check browser to stay in sign up page", async () => {
                    await expect(page).toHaveURL("/auth/signup");
                    await expect(signUpPage.pageTitle).toBeVisible();
                });

                await test.step("Check field value", async () => {
                    for(const fieldName of Object.keys(input.data)) {
                        expect.soft(await signUpPage.getFieldValue(fieldName)).toEqual(input.data[fieldName]);
                    }
                });

                await test.step("Check error message", async () => {
                    await verifyMessageContent(signUpPage, ["Passwords must be at least 4 characters."]);
                });
            });
        }
    });

    test.describe("Throw mismatch password error", () => {
        for(const input of signUpData.mismatchPassword) {
            test(input.name, async({page}) => {
                await signUpPage.fillForm(input.data);
                await signUpPage.clickSignUpButton();

                await test.step("Check browser to stay in sign up page", async () => {
                    await expect(page).toHaveURL("/auth/signup");
                    await expect(signUpPage.pageTitle).toBeVisible();
                });

                await test.step("Check field value", async () => {
                    for(const fieldName of Object.keys(input.data)) {
                        expect.soft(await signUpPage.getFieldValue(fieldName)).toEqual(input.data[fieldName]);
                    }
                });

                await test.step("Check error message", async () => {
                    await verifyMessageContent(signUpPage, ["Passwords do not match."]);
                });
            });
        }
    });

    test.describe("Dont submit form when email is invalid", () => {
        for(const input of signUpData.invalidEmail) {
            test(input.name, async({page}) => {
                let submitted = false;
                page.on("request", (req) => {
                    if(req.url().includes("/auth/signup") && req.method() === "POST") {
                        submitted = true;
                    }
                });

                await signUpPage.fillForm(input.data);
                await signUpPage.clickSignUpButton();

                await test.step("Check browser to stay in sign up page", async () => {
                    await expect(page).toHaveURL("/auth/signup");
                    await expect(signUpPage.pageTitle).toBeVisible();
                });

                await test.step("Check field value", async () => {
                    for(const fieldName of Object.keys(input.data)) {
                        expect.soft(await signUpPage.getFieldValue(fieldName)).toEqual(input.data[fieldName]);
                    }
                });

                await test.step("Check form not submit", async () => {
                    const emailField = signUpPage.getInput("email");
                    const isInvalid = await emailField.evaluate(email => !email.validity.valid);
                    const validationMess = await emailField.evaluate(emai => emai.validationMessage);
                    
                /**
                 * Validate form UI first to ensure stable state,
                 * Then verify no submit request has been triggered.
                 */
                    expect(isInvalid).toBeTruthy();
                    expect(validationMess).toBeTruthy();
                    expect(validationMess.length).toBeGreaterThan(0);
                    expect(submitted).toBeFalsy();
                });
            });
        }
    });

     test.describe("Throw both password errors", () => {
        for(const input of signUpData.bothPasswordErrors) {
            test(input.name, async({page}) => {
                await signUpPage.fillForm(input.data);
                await signUpPage.clickSignUpButton();

                await test.step("Check browser to stay in sign up page", async () => {
                    await expect(page).toHaveURL("/auth/signup");
                    await expect(signUpPage.pageTitle).toBeVisible();
                });

                await test.step("Check field value", async () => {
                    for(const fieldName of Object.keys(input.data)) {
                        expect.soft(await signUpPage.getFieldValue(fieldName)).toEqual(input.data[fieldName]);
                    }
                });

                await test.step("Check error message", async () => {
                    await verifyMessageContent(
                        signUpPage, ["Passwords must be at least 4 characters.", "Passwords do not match."]);
                });
            });
        }
    });
});