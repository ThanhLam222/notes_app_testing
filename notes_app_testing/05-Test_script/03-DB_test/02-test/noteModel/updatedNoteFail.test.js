import { describe, test, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import { connectDB, closeDB } from "../../../02-API_test/02-ultils/mongoServerUtil.js";
import { verifyValidationErrorCorrect } from "../../01-helpers/validationErrorHelper.js";
import Note from "../../../../../notes_app/src/models/Note.js";
import { noteData } from "../../../data/noteAPI_data.js";
import { createNote } from "../../../data/helpers/createNote_helper.js"
import { createAdminUser } from "../../../../../notes_app/src/libs/createUser.js";

describe("Failed to update note", () => {
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

    let noteID;

    beforeEach( async () => {
        await mongoose.connection.collection("notes").deleteMany({});
        /**
         * Prepare for test
         * 1. Create a note before performing test
         * 2. Save noteID to use for test
         */
        const data = {...createNote(), user: userID};
        const note = await new Note(data).save();
        noteID = note._id.toString();
    });

    test("TC_DB_19: fail to update note when title missing", async () => {
        const data = noteData.missingTitle.data;
        let error;
        try {
            const updatedNote = await Note.findByIdAndUpdate(noteID, data, { new: true, runValidators: true });
        } catch (err) {
            error = err;
        }
        verifyValidationErrorCorrect(error, "title");
    });

    test("TC_DB_20: fail to update note when description missing", async () => {
        const data = noteData.missingDescription.data;
        let error;
        try {
            const updatedNote = await Note.findByIdAndUpdate(noteID, data, { new: true, runValidators: true });
        } catch (err) {
            error = err;
        }
        verifyValidationErrorCorrect(error, "description");
    });

    afterAll( async () => {
        await closeDB();
    });
});