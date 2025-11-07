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
import { verifyAllFieldsCorrect } from "../../../03-helpers/assertFieldsFormHelper.js";
import { verifyMessageContent } from "../../../03-helpers/assertMessageHelper.js";
import { verifyRedirectNonLoggedin } from "../../../03-helpers/redirectNonLoggedIn.js";
import { baseUser } from "../../../../data/base_user.js";
import { createAdminUser, createUser } from "../../../../../../notes_app/src/libs/createUser.js";

describe("GET /notes/edit/:id", () => {
    beforeAll( async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
        await createUser();
    });

    beforeEach( async () => {
        await mongoose.connection.collection("notes").deleteMany({});
    });

    describe("GET /notes/edit/:id - logged in", () => {
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

        beforeEach(async () => {
            /** 
             * Send request:
             * The same agent instance is shared between AuthService and NoteService,
             * so create a general agent and pass it to both.
             */
            agentA = request.agent(app);
            const authServiceA = new AuthService(agentA);
            await authServiceA.submitSignInForm(baseUser.userA);
            noteServiceA = new NoteService(agentA);
            noteA = (await createNoteSetup(noteServiceA)).note1;
        });

        test("TC_API_27: GET /notes/edit/:id returns 200 OK with correct note data - owner", async () => {
            const noteIDA = noteA.id;
            const res = await noteServiceA.getEditNoteForm(noteIDA);
            const $ = load(res.text);
            console.log(res.text);

            // Check status and headers
            verifyStatusAndHeader(res, { checkCookie: false});

            /**
             * Check body
             * 1. Check title of page
             * 2. Check form fields display the note correctly
             * 3. Check Save button
             */
            expect($('h3').text().trim()).toEqual("Edit Note");
            
            /**
             * The verifyAllFieldsCorrect helper only works correctly when all data keys,
             * exactly match the form fields. Therefore, the `data` variable includes
             * only `title` and `description`, excluding `id`.
             */
            const editForm = $('form');
            const data = {
                title: noteA.title,
                description: noteA.description,
            }
            const expectedFields = ["Title:", "Description:"];

            verifyAllFieldsCorrect($, expectedFields, data);
            expect(editForm.attr('action')).toEqual(`/notes/edit-note/${noteIDA}?_method=PUT`);

            const saveButton = editForm.find('button');
            expect(saveButton.length).toBeGreaterThan(0);
            expect(saveButton.text().trim()).toEqual("Save");
        });

        describe("GET /notes/edit/:id - not owner", () => {
            let agentB;
            let res;

            beforeEach(async () => {
                agentB = request.agent(app);
                const authServiceB = new AuthService(agentB);
                const noteServiceB = new NoteService(agentB);
                await authServiceB.submitSignInForm(baseUser.userB);
                res = await noteServiceB.getEditNoteForm(noteA.id);
            });

            test("TC_API_29.01: GET /notes/edit/:id returns 302 Found redirect to /notes - non-owner", () => {
                // Check status and headers
                verifyStatusAndHeader(res, {expectedStatus: 302, type: "redirect", checkCookie: false, location: "/notes"});
            });

            test("TC_API_29.02: 'Not Authorized.' flash message appears after failed access by non-owner", async () => {
                const location = res.headers.location;
                expect(location).toBeDefined();

                const redirectRes = await agentB.get(location);
                const $ = load(redirectRes.text);

                // Check status and headers
                verifyStatusAndHeader(redirectRes, { checkCookie: false});

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

    });

    describe("GET /notes/edit/:id - non-logged in", () => {
        let res;
        let freshNoteService;

        beforeEach(async () => {
            // Prepare for test
            /** 
             * Send request:
             * The same agent instance is shared between AuthService and NoteService,
             * so create a general agent and pass it to both.
             */
            agent = request.agent(app);
            const authService = new AuthService(agent);
            await authService.submitSignInForm(baseUser.userA);
            const noteService = new NoteService(agent);
            note = (await createNoteSetup(noteService)).note1;

            /**
             * Send request - non- logged in
             * 1. Create a new agent without logging in by instantiating a fresh NoteService.
             * 2. Use this agent to send the request.
             */

            freshNoteService = new NoteService();
            res = await freshNoteService.getEditNoteForm(note.id);
        });

        test("TC_API_28.01: GET /notes/edit/:id returns 302 Found redirect to /auth/signin", () => {
            // Check status and headers
            verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", location: "/auth/signin"});
        });

        test("TC_API_28.02: 'Not Authorized.' appears on sign in page when accessing Edit Note without login", async () => {
            await verifyRedirectNonLoggedin(freshNoteService, res);
        });
    });

    afterAll(async() => {
        await closeDB();
    });
});