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
import { verifyRedirectNonLoggedin } from "../../../03-helpers/redirectNonLoggedIn.js";
import { verifyNoteContent } from "../../../03-helpers/assertNoteContentHelper.js"
import { baseUser } from "../../../../data/base_user.js";
import { createAdminUser, createUser } from "../../../../../../notes_app/src/libs/createUser.js";

describe("DELETE /notes/delete/:id route", () => {
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
    let agentA;
    let noteServiceA;
    let noteA;
    let count;

    beforeEach(async () => {
        await mongoose.connection.collection("notes").deleteMany({});
        /**
         * Prepare for test:
         * 1. Sign in with userA
         * 2. Create note for userA
         * 3. Save a created note and count of all notes to use for test
         */

        /** 
         * Send request:
         * The same agent instance is shared between AuthService and NoteService,
         * so create a general agent and pass it to both.
         */
        agentA = request.agent(app);
        const authServiceA = new AuthService(agentA);
        await authServiceA.submitSignInForm(baseUser.userA);
        noteServiceA = new NoteService(agentA);
        const notesA = (await createNoteSetup(noteServiceA));
        count = Object.keys(notesA).length;
        noteA = notesA.note1;
    });

    describe("DELETE /notes/delete/:id - logged in and owner", () => {
        let res;

        beforeEach( async () => {
            const noteID = noteA.id;
            res = await noteServiceA.deleteNote(noteID);
        });

        test("TC_API_36.01: Successful note deletion returns 302 Found redirect to /notes", () => {
            // Check status and headers
            verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", checkCookie: false, location: "/notes"});
        });

        test("TC_API_36.02: 'Note Deleted Successfully' appears after successful deletion", async () => {
            const location = res.headers.location;
            expect(location).toBeDefined();

            const redirectRes = await agentA.get(location);
            const $ = load(redirectRes.text);

            // Check status and headers
            verifyStatusAndHeader(redirectRes, { checkCookie: false });

            /**
             * Check body
             * 1. Verify remaining notes to ensure the deleted note is no longer displayed.
             * 2. Verify success message is displayed correctly.
             */
            verifyNoteContent($, {noteA}, { countExistingNotes: count, deleteNote: true });
            
            const expectedMessages = ["Note Deleted Successfully"];
            verifyMessageContent($, expectedMessages);
        });
    });

    describe("DELETE /notes/delete/:id - logged in and non-owner", () => {
        let agentB;
        let res;

        beforeEach( async () => {
            /**
             * Create agentB and send test's request
             * 1. Sign in with userB
             * 2. Send test's request with agentB
             */
            agentB = request.agent(app);
            const authServiceB = new AuthService(agentB);
            await authServiceB.submitSignInForm(baseUser.userB);
            const noteServiceB = new NoteService(agentB);
            const noteID = noteA.id;

            res = await noteServiceB.deleteNote(noteID);
        });

        test("TC_API_37.01:  Failed note deletion returns 302 Found redirect to /notes", () => {
            // Check status and headers
            verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", checkCookie: false, location: "/notes"});
        });

        test("TC_API_37.02: 'Not Authorized.' appears after deletion attempt by non-owner", async () => {
            const location = res.headers.location;
            expect(location).toBeDefined();

            const redirectRes = await agentB.get(location);
            const $ = load(redirectRes.text);

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
    });

    describe("DELETE /notes/delete/:id - non-logged in", () => {
        let freshNoteService;
        let res;

        beforeEach( async () => {
            /**
             * Send request - non- logged in
             * 1. Create a new agent without logging in by instantiating a fresh NoteService.
             * 2. Use this agent to send the request.
             */
            const noteID = noteA.id;
            freshNoteService = new NoteService();
            res = await freshNoteService.deleteNote(noteID);
        });

        test("TC_API_38.01:  Failed note deletion returns 302 Found redirect to /auth/signin", () => {
            // Check status and headers
            verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", location: "/auth/signin"});
        });

        test("TC_API_38.02: 'Not Authorized.' appears after deletion attempt without login", async () => {
            await verifyRedirectNonLoggedin(freshNoteService, res);
        });
    });



    afterAll(async() => {
        await closeDB();
    });

});