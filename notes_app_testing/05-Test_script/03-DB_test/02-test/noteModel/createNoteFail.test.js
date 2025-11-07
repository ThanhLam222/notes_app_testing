import { describe, test, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import { connectDB, closeDB } from "../../../02-API_test/02-ultils/mongoServerUtil.js";
import { verifyValidationErrorCorrect } from "../../01-helpers/validationErrorHelper.js";
import Note from "../../../../../notes_app/src/models/Note.js";
import { noteData } from "../../../data/noteAPI_data.js";
import { createAdminUser } from "../../../../../notes_app/src/libs/createUser.js";

describe("Failed to create note", () => {
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

    beforeEach( async () => {
        await mongoose.connection.collection("notes").deleteMany({});
    });

    test("TC_DB_14: Fail to create note when title missing", async () => {
        const data = {...noteData.missingTitle.data, user: userID};
        let error;
        try {
            const note = await new Note(data).save();
        } catch(err) {
            error = err;
        }

        verifyValidationErrorCorrect(error, "title");
    });

    test("TC_DB_15: Fail to create note when description missing", async () => {
        const data = {...noteData.missingDescription.data, user: userID};
        let error;
        try {
            const note = await new Note(data).save();
        } catch(err) {
            error = err;
        }

        verifyValidationErrorCorrect(error, "description");
    });

    test("TC_DB_16: Fail to create note when user missing", async () => {
        const data = noteData.valid.data;
        let error;
        try {
            const note = await new Note(data).save();
        } catch(err) {
            error = err;
        }

        verifyValidationErrorCorrect(error, "user");
    });


    afterAll( async () => {
        await closeDB();
    });
});