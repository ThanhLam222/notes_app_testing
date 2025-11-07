import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import { connectDB, closeDB } from "../../../02-API_test/02-ultils/mongoServerUtil.js";
import { verifySaveDocumentCorrectly } from "../../01-helpers/saveDataCorrectHelper.js";
import Note from "../../../../../notes_app/src/models/Note.js";
import { noteData } from "../../../data/noteAPI_data.js";
import { createNote } from "../../../data/helpers/createNote_helper.js"
import { createAdminUser } from "../../../../../notes_app/src/libs/createUser.js";

describe("Note updated successfully", () => {
    let userID;

    beforeAll( async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();

        // Get userID to use for creating note
        userID = (await mongoose.connection.collection("users")
                                           .findOne({email: "admin@localhost"}))
                                           ._id.toString();

    });

    let updatedNote;
    let updateData;
    let note;
    beforeEach( async () => {
        await mongoose.connection.collection("notes").deleteMany({});
        /**
         * Prepare for test
         * 1. Create a note before performing test
         * 2. Save noteID to use for test
         */
        const data = {...createNote(), user: userID};
        note = await new Note(data).save();
        const noteID = note._id.toString();

        // Update note
        updateData = noteData.valid.data;
        updatedNote = await Note.findByIdAndUpdate(noteID, updateData, {new: true, runValidators: true});
    });

    test("TC_DB_17: Update note successfully with all valid note fields", () => {
        verifySaveDocumentCorrectly(updatedNote, updateData);
        expect(updatedNote._id.toString()).toEqual(note._id.toString());
    });

    test("TC_DB_18: updatedAt are automatically generated when updating an existing document", () => {
        expect(updatedNote.createdAt).toEqual(note.createdAt);
        expect(+new Date(updatedNote.updatedAt)).toBeGreaterThan(+new Date(note.createdAt));
    });

    afterAll( async () => {
        await closeDB();
    });
});