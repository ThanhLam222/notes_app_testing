import { test, expect } from "../../../02-fixtures/login_fixture.js";
import { NewNotePage } from "../../../01-POM/note/newnotepage.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";
import { noteData } from "../../../../data/note_data.js";

test.describe("Submit invalid new note form - logged in user", () => {
    let newNotePage;

    test.beforeEach(async ({ login, page }) => {
        newNotePage = new NewNotePage(page);
        await newNotePage.goto();
    });

    test.describe("Throw both missing fields error", () => {
        for(const input of noteData.bothFieldsEmpty) {
            const data = input.data;

            test(input.nameCreate, async ({page}) => {
                await newNotePage.fillForm(data);
                await newNotePage.clickSaveButton();

                await test.step("Check browser to stay in new note page", async () => {
                    await expect(page).toHaveURL("/notes/new-note");
                    await expect(newNotePage.pageTitle).toBeVisible();
                });

                await test.step("Check field value", async () => {
                    for(const fieldName of Object.keys(data)) {
                        expect.soft(await newNotePage.getFieldValue(fieldName)).toEqual("");
                    }
                });

                await test.step("Check error messages", async () => {
                    await verifyMessageContent(newNotePage, [ "Please Write a Title.", "Please Write a Description."]);
                });
            });
        }
    });

    test.describe("Throw missing title error", () => {
        for(const input of noteData.missingTitle) {
            const data = input.data;

            test(input.nameCreate, async ({page}) => {
                await newNotePage.fillForm(data);
                await newNotePage.clickSaveButton();

                await test.step("Check browser to stay in new note page", async () => {
                    await expect(page).toHaveURL("/notes/new-note");
                    await expect(newNotePage.pageTitle).toBeVisible();
                });

                await test.step("Check field value", async () => {
                    for(const fieldName of Object.keys(data)) {
                        expect.soft(await newNotePage.getFieldValue(fieldName)).toEqual(data[fieldName]);
                    }
                });

                await test.step("Check error messages", async () => {
                    await verifyMessageContent(newNotePage, [ "Please Write a Title."]);
                });
            });
        }
    });

    test.describe("Throw missing description error", () => {
        for(const input of noteData.missingDescription) {
            const data = input.data;

            test(input.nameCreate, async ({page}) => {
                await newNotePage.fillForm(data);
                await newNotePage.clickSaveButton();

                await test.step("Check browser to stay in new note page", async () => {
                    await expect(page).toHaveURL("/notes/new-note");
                    await expect(newNotePage.pageTitle).toBeVisible();
                });

                await test.step("Check field value", async () => {
                    for(const fieldName of Object.keys(data)) {
                        expect.soft(await newNotePage.getFieldValue(fieldName)).toEqual(data[fieldName]);
                    }
                });

                await test.step("Check error messages", async () => {
                    await verifyMessageContent(newNotePage, [ "Please Write a Description."]);
                });
            });
        }
    });

});