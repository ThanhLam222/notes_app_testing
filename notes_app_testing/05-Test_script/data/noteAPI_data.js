import { makeTestCase } from './helpers/testCase_helper.js';
import { createNote } from './helpers/createNote_helper.js';

const makeNoteCase = makeTestCase(createNote);

export const noteData = {
    valid: makeNoteCase(),
    missingTitle: makeNoteCase({agrs: [{title: ""}]}),
    missingDescription: makeNoteCase({agrs: [{description: ""}]}),
    missingBothField: makeNoteCase({agrs: [{title: "", description: ""}]}),
}

// for(const key in noteData) {
//     console.log(JSON.stringify(noteData[key]));
// }