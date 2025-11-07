import mongoose from "mongoose";
import { createNote } from "../../data/helpers/createNote_helper.js";
/**
 * Used for set up when test precondition required notes exists.
 * 
 * @param {Object} noteService - instance of NoteService class used for testing.
 * @param {number} count - Number of notes to create. Defaults to 3 if not provided.
 * @returns {Object} An object where each key represents a note ID, 
 *                   and each value contains { title, description, id } of that note.
 * 
 * @example
 * const note = await createNoteSetUp(noteService)
 */
export async function createNoteSetup(noteService, count = 3) {
    let noteInput = {};
            
    // Prepare notes for test
    for(let i = 0; i < count; ++ i) {
        const note = createNote();
        await noteService.submitNewNoteForm(note);

        // Get id to use for test
        const createdNote = await mongoose.connection
        .collection("notes")
        .findOne({ title: note.title });

        noteInput[`note${i + 1}`] = {...note, id: createdNote._id.toString()};
        // console.log(JSON.stringify(noteInput[`note${i + 1}`]));
    }

    return noteInput;
}