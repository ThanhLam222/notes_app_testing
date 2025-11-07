import { test, expect } from "../../../02-fixtures/authorized_fixture.js";
import { EditNotePage } from "../../../01-POM/note/editnotepage.js";
import { AllNotesPage } from "../../../01-POM/note/allnotespage.js";
import { verifyAllNotesPageLoaded } from "../../../03-helpers/allNotesPageLoadedHelper.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";

test("TC_UI_26: Edit view fails - non-owner", async ({ createNote, loginToCheckAuthorization }) => {
    /**
     * Using "createNote" fixture to create note for userA
     * and "loginToCheckAuthorization" fixture to log in as a different user (userB)
     * 1. Ensure userA has notes
     * 2. Save id of a userA's note to use for test
     * 3. Perform test with userB
     */

    // Ensure userA has notes before userB attempt to access userA's notes
    const { allNotesPage, notes, countExistingNotes, count} = createNote;
    const countActualNotes = await allNotesPage.allNotes.count();
    expect(countActualNotes).toEqual(countExistingNotes + count);

    // Save noteID of userA to use for test
    const noteID = notes.note1.id;
    const { page : pageB } = loginToCheckAuthorization;

    // Perform test with userB
    const editNotepage = new EditNotePage(pageB);
    await editNotepage.goto(noteID);
    const allNotesPageB = new AllNotesPage(pageB);

    await test.step("Check redirected to correct URL", async () => {
        await expect(pageB).toHaveURL("/notes");
        await verifyAllNotesPageLoaded(allNotesPageB);
    });

    await test.step("Check authorization message", async () => {
        await verifyMessageContent(allNotesPageB, ["Not Authorized."]);
    });

});