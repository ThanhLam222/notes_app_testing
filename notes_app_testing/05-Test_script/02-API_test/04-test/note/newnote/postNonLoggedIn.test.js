import { describe, test, beforeAll, beforeEach, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { NoteService } from "../../../01-SOM/noteService.js"
import { connectDB, closeDB } from "../../../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { verifyRedirectNonLoggedin } from "../../../03-helpers/redirectNonLoggedIn.js";
import { noteData } from "../../../../data/noteAPI_data.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js";

describe("POST /notes/new-note - non logged in", () => {
    beforeAll(async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    let noteService;
    let res;
    beforeEach(async () => {
        await mongoose.connection.collection("notes").deleteMany({});
        noteService = new NoteService();
        res = await noteService.submitNewNoteForm(noteData.valid.data);
    });

    test("TC_API_23.01: Note creation returns 302 Found redirect to /auth/signin when not logged in", async () => {
        // Check status and headers
        verifyStatusAndHeader(res, {expectedStatus: 302, type: "redirect", location: "/auth/signin"});
    });

    test("TC_API_23.02: 'Not Authorized.' appears after failed note creation without login", async () => {
        await verifyRedirectNonLoggedin(noteService, res);
    });

    afterAll(async () => {
        await closeDB()
    });

});