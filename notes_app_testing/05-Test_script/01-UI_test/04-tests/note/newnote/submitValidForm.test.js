import { test, expect } from "../../../02-fixtures/login_fixture.js";
import { NewNotePage } from "../../../01-POM/note/newnotepage.js";
import { AllNotesPage } from "../../../01-POM/note/allnotespage.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";
import { verifyAllNotesPageLoaded } from "../../../03-helpers/allNotesPageLoadedHelper.js";
import { verifyNoteContent } from "../../../03-helpers/noteContentHelper.js";
import { noteData } from "../../../../data/note_data.js";

test.describe("Submit valid new note form - logged in user", () => {
    let newNotePage;
    let allNotesPage;
    let countExistingNotes;

    test.beforeEach(async ({login, page}) => {
        allNotesPage = new AllNotesPage(page);
        countExistingNotes = await allNotesPage.allNotes.count();
        newNotePage = new NewNotePage(page);
        await newNotePage.goto();
    });

    for(const input of noteData.valid) {
        test(input.nameCreate, async ({page}) => {
            const data = input.data;
            await newNotePage.fillForm(data);
            await newNotePage.clickSaveButton();

            await test.step("Check redirected to correct URL", async () => {
                await expect(page).toHaveURL("/notes");
                await verifyAllNotesPageLoaded(allNotesPage);
            });

            await test.step("Check success message", async () => {
                await verifyMessageContent(allNotesPage, ["Note Added Successfully"]);
            });

            await test.step("Check note displayed correctly", async () => {
                await verifyNoteContent(allNotesPage, {data}, countExistingNotes);
            });
        });
    }
});