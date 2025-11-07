import { expect} from "@playwright/test";

/**
 * Verifies the notes list after performing add or delete actions.
 *
 * @param {Object} allNotesPage - Page Object instance created from the AllNotesPage POM, which contains locators for all notes.
 * @param {Object} data - An object where each key represents a note ID, and each value contains { title, description } of that note.
 * @param {number} countExistingNotes - The number of notes before performing the action related to data variable.
 * @param {Object} [options={deleteNote: false}] - Options object.
 * @param {boolean} [options.deleteNote=false] - Whether the verification is for a delete action (true) or an add action (false).
 *
 * The function checks:
 * - The total count of notes changes correctly (increase/decrease).
 * - Each note in `data` is found or not found according to the action.
 */
export async function verifyNoteContent(allNotesPage, data, countExistingNotes, options = {deleteNote: false}) {

    const notesContainer = allNotesPage.allNotes;
    const countChange = Object.keys(data).length*(options.deleteNote ? -1  : 1);
    const count = await notesContainer.count();
    let found = false;

    expect(count).toEqual(countExistingNotes + countChange);

    for(const key of Object.keys(data)) {
        found = false;

        for(let i = 0; i < count; ++i) {
            const title = (await allNotesPage.getNoteTitle(i).innerText()).toLowerCase();
            const description = (await allNotesPage.getNoteDescription(i).innerText()).toLowerCase();
            if(title === data[key].title.toLowerCase() && description === data[key].description.toLowerCase()) {
                found = true;
                break;
            }
        }

        if(options.deleteNote) {
            expect(found).toBeFalsy();
        } 
        else {
            expect(found).toBeTruthy();
        }
    }
}