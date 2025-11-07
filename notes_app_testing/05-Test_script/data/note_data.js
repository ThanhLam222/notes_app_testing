import { makeTestCase } from './helpers/testCase_helper.js';
import { createNote } from './helpers/createNote_helper.js';

const makeNoteCase = makeTestCase(createNote);

export const noteData = {
    valid: [makeNoteCase({nameCreate: "TC_UI_19.01: Note creation succeeds", nameUpdate: "TC_UI_25.01: Note update succeeds"}),],
    bothFieldsEmpty: [makeNoteCase({ 
        nameCreate: "TC_UI_19.02: Note creation fails - both fields empty",
        nameUpdate: "TC_UI_25.02: Note update fails - both fields empty",
        agrs: [{title: "", description: ""}],
    }),],
    missingTitle: [makeNoteCase({
        nameCreate: "TC_UI_19.03: Note creation fails - title empty",
        nameUpdate: "TC_UI_25.03: Note update fails - title empty",
        agrs: [{title: ""}],
    }),],
    missingDescription: [makeNoteCase({
        nameCreate: "TC_UI_19.04: Note creation fails - description empty",
        nameUpdate: "TC_UI_25.04: Note update fails - description empty",
        agrs: [{description: ""}],
    }),],

}

// for(const key in noteData) {
// console.log(JSON.stringify(noteData[key]));
// }

