import { describe, test, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";
import { load } from "cheerio";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../../../../../notes_app/src/app.js";
import { AuthService } from "../../../01-SOM/authService.js";
import { NoteService } from "../../../01-SOM/noteService.js";
import { connectDB, closeDB } from "../../../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { createNoteSetup } from "../../../03-helpers/createNoteHelper.js";
import { verifyMessageContent } from "../../../03-helpers/assertMessageHelper.js";
import { baseUser } from "../../../../data/base_user.js";
import { noteData } from "../../../../data/noteAPI_data.js";
import { createAdminUser, createUser } from "../../../../../../notes_app/src/libs/createUser.js";


describe("PUT /notes/edit-note/:id with valid payoad - non owner", () => {
    beforeAll( async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
        await createUser();
    });

    /**
     * This describe block tests both the owner and non-owner of notes.
     * - userA: note owner
     * - userB: non-owner
     * 
     * Variables related to userA are suffixed with "A" (e.g., agentA, noteServiceA, ...).
     * Variables related to userB follow the same pattern.
     */

    let agentB;
    let notesA;
    let res;

    beforeEach( async () => {
        await mongoose.connection.collection("notes").deleteMany({});
        /**
         * Prepare for test:
         * 1. Sign in with userA
         * 2. Create note for userA
         * 3. Save a created note to use for test
         */

        /** 
         * Send request:
         * The same agent instance is shared between AuthService and NoteService,
         * so create a general agent and pass it to both.
         */
        const agentA = request.agent(app);
        const authServiceA = new AuthService(agentA);
        await authServiceA.submitSignInForm(baseUser.userA);
        const noteServiceA = new NoteService(agentA);
        notesA = (await createNoteSetup(noteServiceA));
        const noteIDA = notesA.note1.id;

        /**
         * Create agentB and send test's request
         * 1. Sign in with userB
         * 2. Send test's request with agentB
         */
        agentB = request.agent(app);
        const authServiceB = new AuthService(agentB);
        await authServiceB.submitSignInForm(baseUser.userB);
        const noteServiceB = new NoteService(agentB);

        res = await noteServiceB.submitEditNoteForm(noteIDA, noteData.valid.data);
    });

    test("TC_API_34.01: PUT /notes/edit-note/:id returns 302 Found redirect to /notes", () => {
        // Check status and headers
        verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", checkCookie: false, location: "/notes"});
    });

    test("TC_API_34.02: 'Not Authorized' appears after edit attempt by non-owner", async () => {
        const location = res.headers.location;
        expect(location).toBeDefined();

        const redirectRes = await agentB.get(location);
        const $ = load(redirectRes.text);
        console.log(redirectRes.text);

        // Check status and headers
        verifyStatusAndHeader(redirectRes, { checkCookie: false });

        /**
         * Check body
         * 1. Verify error messages displayed correctly.
         * 2. Verify that redirection goes to the correct page by checking the "no note" notification.
         */

        const expectedMessages = ["Not Authorized."];
        verifyMessageContent($, expectedMessages);
        
        const noNoteNotice = $('p.lead');
        expect(noNoteNotice.length).toBe(1);
    });

    afterAll(async() => {
        await closeDB();
    });
});