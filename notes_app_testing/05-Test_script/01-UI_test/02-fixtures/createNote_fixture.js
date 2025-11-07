import { test as base} from "./login_fixture.js";
import { AllNotesPage} from "../01-POM/note/allnotespage.js"
import { NewNotePage} from "../01-POM/note/newnotepage.js"
import { createNote } from "../../data/helpers/createNote_helper.js";

export const test = base.extend({
    createNote: async ({login, page}, use, testInfo) => {
        const allNotesPage = new AllNotesPage(page);
        const countExistingNotes = await allNotesPage.allNotes.count();
        const count = testInfo.project.use?.noteCount ?? 3;
        const notes = {};

        for(let i = 0; i < count; ++i) {
            const newNotesPage = new NewNotePage(page);
            const noteData = createNote();

            // save note.title and description into object to use for test
            notes[`note${i+1}`] = {...noteData};

            await newNotesPage.goto();
            await page.waitForURL('/notes/add');
            await newNotesPage.fillForm(noteData);
            await newNotesPage.clickSaveButton();
            await page.waitForURL('/notes');

            // save note.id into object to use for edit and delete

            const href = await page.getByRole('heading', {name: new RegExp(`^\\s*${noteData.title}\\s*`, "i")})
                                   .locator('a')
                                   .getAttribute('href');
            
            if (!href) {
                throw new Error(`Cannot get href for note title: "${noteData.title}"`);
            }
            const noteID = href.split("/").pop();
            notes[`note${i+1}`].id = noteID;
        }

        await use({allNotesPage, notes, countExistingNotes, count});
        
        await allNotesPage.goto();
        await allNotesPage.removeAll();
    },
})

export { expect } from "@playwright/test";