import { test, expect } from "@jest/globals";
import mongoose from "mongoose";
import { connectDB, closeDB } from "../../../02-API_test/02-ultils/mongoServerUtil.js";
import Note from "../../../../../notes_app/src/models/Note.js";
import { createNote } from "../../../data/helpers/createNote_helper.js"
import { createAdminUser } from "../../../../../notes_app/src/libs/createUser.js";

test("TC_DB_21: Note is removed from database when note deleted successfully", async () => {
    /**
     * Prepare for test
     * 1. Set up database
     * 2. Clean users, sessions and notes collection from database to have a fresh database
     * 3. Save an user to database
     * 4. Create a note with this user's id
     */
    await connectDB();
    await mongoose.connection.collection("users").deleteMany({});
    await mongoose.connection.collection("sessions").deleteMany({});
    await mongoose.connection.collection("notes").deleteMany({});
    await createAdminUser();

    // Get userID to use for creating note
    const userID = (await mongoose.connection.collection("users")
                                             .findOne({email: "admin@localhost"}))
                                             ._id.toString();
                
    // Create note
    const data = {...createNote(), user: userID};
    const note = await new Note(data).save();
    const noteID = note._id.toString();

    /**
     * Perform test
     * 1. Delete note by note's ID
     * 2. Query to verify that deleted note is no longer found in the database
     */
    await Note.findByIdAndDelete(noteID);

    const deletedNote = await Note.findById(noteID);
    expect(deletedNote).toBeNull();

    // Teardown database
    await closeDB();
});


