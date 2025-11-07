import { describe, test, beforeAll, beforeEach, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../../../../../notes_app/src/app.js";
import { AuthService } from "../../../01-SOM/authService.js";
import { NoteService } from "../../../01-SOM/noteService.js"
import { connectDB, closeDB } from "../../../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { verifyRedirectNonLoggedin } from "../../../03-helpers/redirectNonLoggedIn.js";
import { createNoteSetup } from "../../../03-helpers/createNoteHelper.js";
import { noteData } from "../../../../data/noteAPI_data.js";
import { baseUser } from "../../../../data/base_user.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js";


describe("PUT /notes/edit-note/:id with valid payoad - non-logged in", () => {
    beforeAll( async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    let freshNoteService;
    let res;

    beforeEach( async () => {
        await mongoose.connection.collection("notes").deleteMany({});
        /**
         * Prepare for test:
         * 1. Sign in
         * 2. Create note for user
         * 3. Save a created note to use for test
         */

        /** 
         * Send request:
         * The same agent instance is shared between AuthService and NoteService,
         * so create a general agent and pass it to both.
         */
        agent = request.agent(app);
        const authService = new AuthService(agent);
        await authService.submitSignInForm(baseUser.userA);
        const noteService = new NoteService(agent);
        const note = (await createNoteSetup(noteService)).note1;
        const noteID = note.id;


        /**
         * Send request - non- logged in
         * 1. Create a new agent without logging in by instantiating a fresh NoteService.
         * 2. Use this agent to send the request.
         */
        freshNoteService = new NoteService();
        res = await freshNoteService.submitEditNoteForm(noteID, noteData.valid.data);
    });

    test("TC_API_35.01: PUT /notes/edit-note/:id returns 302 Found redirect to  to /auth/signin", () => {
        // Check status and headers
        verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", location: "/auth/signin"});
    });

    test("TC_API_35.02: 'Not Authorized' ppears after edit attempt without login", async () => {
        await verifyRedirectNonLoggedin(freshNoteService, res);
    });

    afterAll(async() => {
        await closeDB();
    });
});