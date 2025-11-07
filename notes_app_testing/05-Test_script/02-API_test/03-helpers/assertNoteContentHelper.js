import { expect } from "@jest/globals";
/**
 * Verifies the notes list after performing add or delete actions.
 * 
 * @param {Object} $ - Cheerio root object representing the loaded HTML.
 * @param {Object} data - An object where each key represents a note ID, and each value contains { title, description } of that note
 * @param {Object} [{ countExistingNotes = 0, deleteNote = false} = {}] - Destructuring object with default value.
 * @param {number} countExistingNotes - The number of notes before performing the action related to data variable.
 * @param {boolean} deleteNote - Whether the verification is for a delete action (true) or an add action (false).
 * 
 * @example
 * `verifyNoteContent($, {note1: {title: title1, description: description1 }, note2 {title: title2, description: description2}}
 *                     , {countExistingNotes: 3, deletNote: true})`
 */
export function verifyNoteContent($, data, { countExistingNotes = 0, deleteNote = false} = {} ) {
    const allNotes = $('div.card-body').toArray();
    const countChange = Object.keys(data).length*(deleteNote ? -1  : 1);
    const count = allNotes.length;
    let found = false;

    expect(count).toBe(countExistingNotes + countChange);

    // Traverse each note in `data`
    for(const key of Object.keys(data)) {
        found = false;

        for(const note of allNotes) {
            const title = $(note).find('h4').text().trim();
            const description = $(note).find('p').text().trim();

            if(data[key].title === title && data[key].description === description) {
                found = true;
                break;
            }
        }

        if(deleteNote) {
            expect(found).toBeFalsy();
        } 
        else {
            expect(found).toBeTruthy();
        }
    }
}