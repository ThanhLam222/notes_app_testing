"use strict";

import { EditNotePage } from "../../01-POM/note/editnotepage.js";
import {test, expect} from "../../02-fixtures/createNote_fixture.js";

test.describe('Create note fixture', () => {

        test("check value", async ({createNote, page}) => {
            const editNotePage = new EditNotePage(page);
            const notes = createNote.notes;
             for (let noteKey in notes) {
                const note = notes[noteKey];

                await editNotePage.goto(note.id);
                for (let key in note) {
                    if (key === "id") continue;
                    const value = await editNotePage.getFieldValue(key);
                    await expect(value).toStrictEqual(note[key]);
                }

             }
            
        });

    test("check numbers of notes", async ({createNote}) => {
        await expect(createNote.allNotesPage.allNotes).toHaveCount(3);
    });
});