import { test, expect } from "../../../02-fixtures/createNote_fixture.js";
import { verifyAllNotesPageLoaded } from "../../../03-helpers/allNotesPageLoadedHelper.js";
import { verifyNoteContent } from "../../../03-helpers/noteContentHelper.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";

test("TC_UI_28: Note deletion succeeds - logged in and owner", async ({ createNote, page }) => {
    /**
     * 1. Ensure notes have been created by using "createNote" fixture
     * 2. Save title and description of note before deletion to use for test
     * 3. Perform test by clicking "Delete" button of a note
     */

    // Ensure notes created successfully
    const { allNotesPage, notes, countExistingNotes, count } = createNote;
    const totalNotes = countExistingNotes + count;
    expect(await allNotesPage.allNotes.count()).toEqual(totalNotes);

    // Get and save title and description to use later
    const title = (await allNotesPage.getNoteTitle(0).innerText()).toLowerCase();
    const description = (await allNotesPage.getNoteDescription(0).innerText()).toLowerCase();
    
    //Perform test by click "Delete" button of a note
    await allNotesPage.clickDeleteButton(0);

    await test.step("Check redirected to correct URL", async () => {
        await expect(page).toHaveURL("/notes");
        await verifyAllNotesPageLoaded(allNotesPage);
    });

    await test.step("Check note deletion succeeds", async () => {
        await verifyNoteContent(allNotesPage, { data: { title, description}}, totalNotes, {deleteNote: true});
    });

    await test.step("Check success message", async () => {
        await verifyMessageContent(allNotesPage, ["Note Deleted Successfully"]);
    });
});
