import { test, expect } from "../../../02-fixtures/createNote_fixture.js";
import { EditNotePage } from "../../../01-POM/note/editnotepage.js";
import { verifyallFieldsCorrect } from "../../../03-helpers/allFieldsFormHelper.js";

test.describe("Verification edit note page UI - logged in user and owner", () => {
    let notes;
    let editNotePage;

    test.beforeEach(async ({ createNote, page }) => {
        ({ notes } = createNote);
        editNotePage = new EditNotePage(page);
    });
    
    // Check one note to ensure Edit Note page title is displayed correctly
    test("TC_UI_23: Edit note page title visible for owner", async () => {
        const noteID = notes.note1.id;
        editNotePage.goto(noteID);
        await expect(editNotePage.pageTitle).toBeVisible();
    });

    test("TC_UI_24:  Edit form fields and elements displayed correctly for owner", async () => {
        for(const key of Object.keys(notes)) {
            const noteID = notes[key].id;
            await editNotePage.goto(noteID);

            await test.step("Check all fields in edit note form", async () => {
                // Verify appearance of fields
                const expectedName = ["Title:", "Description:"];
                await verifyallFieldsCorrect(editNotePage, expectedName);

                // Verify value of fields
                expect.soft(await editNotePage.getFieldValue("title")).toEqual(notes[key].title);
                expect.soft(await editNotePage.getFieldValue("description")).toEqual(notes[key].description);
            });

            await test.step("Check 'Save' button visible", async () => {
                await expect(editNotePage.saveButton).toBeVisible();
            });
        }
    });
});