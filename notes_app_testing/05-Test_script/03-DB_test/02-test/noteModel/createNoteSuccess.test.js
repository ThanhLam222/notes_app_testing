import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import { connectDB, closeDB } from "../../../02-API_test/02-ultils/mongoServerUtil.js";
import { verifySaveDocumentCorrectly } from "../../01-helpers/saveDataCorrectHelper.js";
import Note from "../../../../../notes_app/src/models/Note.js";
import { noteData } from "../../../data/noteAPI_data.js";
import { createAdminUser } from "../../../../../notes_app/src/libs/createUser.js";

describe("Note created successfully", () => {
    let userID;

    beforeAll( async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();

        // Get userID to use for test
        userID = (await mongoose.connection.collection("users")
                                           .findOne({email: "admin@localhost"}))
                                           ._id.toString();

    });

    let note;
    let data;

    beforeEach( async () => {
        await mongoose.connection.collection("notes").deleteMany({});
        data = {...noteData.valid.data, user: userID};
        note = await new Note(data).save();
    });

    test("TC_DB_12: Create user successfully with all valid new note fields", () => {
        verifySaveDocumentCorrectly(note, data);
    });

    test("TC_DB_13: createdAt and updatedAt are automatically generated when inserting a new document", () => {
        expect(note.createdAt).toBeDefined();
        expect(note.updatedAt).toBeDefined();
        expect(note.createdAt).toEqual(note.updatedAt);
    });


    afterAll( async () => {
        await closeDB();
    });

});