import { test, expect } from "../../../02-fixtures/createNote_fixture.js";
import { EditNotePage } from "../../../01-POM/note/editnotepage.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";
import { noteData } from "../../../../data/note_data.js";

test.describe("Submit invalid edit note form - logged in user and owner", () => {
    let notes;
    let noteID;
    let editNotePage;

    test.beforeEach(async ({ createNote, page }) => {
        ({ notes } = createNote);
        noteID = notes.note1.id;
        editNotePage = new EditNotePage(page);

        await editNotePage.goto(noteID);
    });

    test.describe("Throw both missing fields error", () => {
        for(const input of noteData.bothFieldsEmpty) {
            const data = input.data;

            test(input.nameUpdate, async ({page}) => {
                await editNotePage.fillForm(data);
                await editNotePage.clickSaveButton();

                await test.step("Check browser to stay in edit note page", async () => {
                    await expect(page).toHaveURL(`/notes/edit-note/${noteID}`);
                    await expect(editNotePage.pageTitle).toBeVisible();
                });

                await test.step("Check field value", async () => {
                    for(const fieldName of Object.keys(data)) {
                        expect.soft(await editNotePage.getFieldValue(fieldName)).toEqual("");
                    }
                });

                await test.step("Check error messages", async () => {
                    await verifyMessageContent(editNotePage, [ "Please Write a Title.", "Please Write a Description."]);
                });
            });
        }
    });

    test.describe("Throw missing title error", () => {
        for(const input of noteData.missingTitle) {
            const data = input.data;

            test(input.nameUpdate, async ({page}) => {
                await editNotePage.fillForm(data);
                await editNotePage.clickSaveButton();

                await test.step("Check browser to stay in edit note page", async () => {
                    await expect(page).toHaveURL(`/notes/edit-note/${noteID}`);
                    await expect(editNotePage.pageTitle).toBeVisible();
                });

                await test.step("Check field value", async () => {
                    for(const fieldName of Object.keys(data)) {
                        expect.soft(await editNotePage.getFieldValue(fieldName)).toEqual(data[fieldName]);
                    }
                });

                await test.step("Check error messages", async () => {
                    await verifyMessageContent(editNotePage, [ "Please Write a Title."]);
                });
            });
        }
    });

    test.describe("Throw missing description error", () => {
        for(const input of noteData.missingDescription) {
            const data = input.data;

            test(input.nameUpdate, async ({page}) => {
                await editNotePage.fillForm(data);
                await editNotePage.clickSaveButton();

                await test.step("Check browser to stay in edit note page", async () => {
                    await expect(page).toHaveURL(`/notes/edit-note/${noteID}`);
                    await expect(editNotePage.pageTitle).toBeVisible();
                });

                await test.step("Check field value", async () => {
                    for(const fieldName of Object.keys(data)) {
                        expect.soft(await editNotePage.getFieldValue(fieldName)).toEqual(data[fieldName]);
                    }
                });

                await test.step("Check error messages", async () => {
                    await verifyMessageContent(editNotePage, [ "Please Write a Description."]);
                });
            });
        }
    });
});