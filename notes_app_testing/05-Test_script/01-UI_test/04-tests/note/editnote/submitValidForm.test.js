import { test, expect } from "../../../02-fixtures/createNote_fixture.js";
import { EditNotePage } from "../../../01-POM/note/editnotepage.js";
import { verifyAllNotesPageLoaded } from "../../../03-helpers/allNotesPageLoadedHelper.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";
import { noteData } from "../../../../data/note_data.js";

test.describe("Submit valid edit note form - logged in and owner", () => {
    let allNotesPage, notes, countExistingNotes, count;
    let editNotePage;
    let noteID;

    test.beforeEach(async ({ createNote, page}) => {
        ({allNotesPage, notes, countExistingNotes, count} = createNote);
        noteID = notes.note1.id;
        editNotePage = new EditNotePage(page);
        await editNotePage.goto(noteID);
    });

    for(const input of noteData.valid) {
        test(input.nameUpdate, async ({page}) => {
            const data = input.data;
            await editNotePage.fillForm(data);
            await editNotePage.clickSaveButton();

            await test.step("Check redirected to correct URL", async () => {
                await expect(page).toHaveURL("/notes");
                await verifyAllNotesPageLoaded(allNotesPage);
            });

            // Verify that the total number of notes stays the same after updating a note
            await test.step("Check all existing notes displayed", async () => {
                const countAfterUpdate = await allNotesPage.allNotes.count();
                expect.soft(countAfterUpdate).toEqual(countExistingNotes + count);
            });

            // Get and check content by ID to ensure note updated exactly
            await test.step("Check note displayed with update content", async () => {
                const updatedNote = allNotesPage.allNotes.filter({has: page.locator(`a[href="/notes/edit/${noteID}"]`)});
                await expect(updatedNote).toHaveCount(1);
                const upDatedTitle = (await updatedNote.getByRole('heading').innerText()).toLowerCase();
                const updateDescription = (await updatedNote.locator('p').innerText()).toLowerCase();

                expect(upDatedTitle).toEqual(data.title.toLowerCase());
                expect(updateDescription).toEqual(data.description.toLowerCase());
            });

            await test.step("Check success message", async () => {
                await verifyMessageContent(allNotesPage, ["Note Updated Successfully"]);
            });
        });
    }
});