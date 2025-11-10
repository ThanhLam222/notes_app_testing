import fs from "fs";
import { createNote } from "../data/helpers/createNote_helper.js";

function noteDataPostman(data = true, { allNotes = false, getNewForm = false, postNewNote = false, editNote = false, deleteNote = false, hasNote} = {}) {
    let note;

    if(data) {
        note = createNote();
    }

    let result = {
        ...(note ? note : {}),
        allNotes,
        getNewForm,
        postNewNote,
        editNote,
        deleteNote,
    }

    if(allNotes) {
        result.hasNote = hasNote;
    }

    return result;
}

const noteData = [
    noteDataPostman(false, {allNotes: true, getNewForm: true, hasNote: false}), // Check all notes no notes and get New note form
    noteDataPostman(true, {postNewNote: true}), // create note
    noteDataPostman(true, {postNewNote: true}), // create note
    noteDataPostman(true, {postNewNote: true}), // create note
    noteDataPostman(true, {allNotes: true, editNote: true, deleteNote: true, hasNote: true}), // check all notes has notes and , edit, delete note
]

const jsonData = JSON.stringify(noteData, null, 2);
console.log(jsonData);

fs.writeFileSync("note_data.json", jsonData);