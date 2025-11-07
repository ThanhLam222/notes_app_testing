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
import { verifyNoteContent } from "../../../03-helpers/assertNoteContentHelper.js";
import { verifyRedirectNonLoggedin } from "../../../03-helpers/redirectNonLoggedIn.js";
import { baseUser } from "../../../../data/base_user.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js";


describe("GET /notes route", () => {
    beforeAll( async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    describe("Get /notes route - logged in", () => {
        let noteService;

        beforeEach( async () => {
            await mongoose.connection.collection("notes").deleteMany({});
            /** 
            * Send request:
            * The same agent instance is shared between AuthService and NoteService,
            * so create a general agent and pass it to both.
            */
           agent = request.agent(app);
           const authService = new AuthService(agent);
           await authService.submitSignInForm(baseUser.userA);
           noteService = new NoteService(agent);
        });

        test("TC_API_24:  GET /notes returns 200 OK with All notes page - has notes", async () => {
            // Prepare notes for test
            const notes = await createNoteSetup(noteService);

            // Send GET /notes request
            const res = await noteService.getAllNotesPage();
            const $ = load(res.text);

            // Check status and headers
            verifyStatusAndHeader(res, { checkCookie: false});

            /**
             * Check body
             * 1. Check all notes displayed
             * 2. Check edit and delete icon/button
             * 3. Check order of all notes
             */
            // Check all notes displayed
            verifyNoteContent($, notes);

            // Check edit and delete icon/button
            const allNotes = $('div.card-body');
            allNotes.each((i, el) => {
                const editHref = $(el).find('h4 > a').attr('href');
                expect(editHref).toBeDefined();

                const deleteForm = $(el).find('form');
                expect(deleteForm.length).toBeGreaterThan(0);

                const deleteAttr = deleteForm.attr('action');
                expect(deleteAttr).toBeDefined();

                const deleteButton = deleteForm.find('button');
                expect(deleteButton.length).toBeGreaterThan(0);

                expect(editHref).toMatch(/^\/notes\/edit\/[a-f\d]{24}$/);
                expect(deleteAttr).toMatch(/^\/notes\/delete\/[a-f\d]{24}\?_method=DELETE$/);
                expect(deleteButton.text().trim()).toEqual("Delete");
            });

            // Check order of notes: by date descending
            let order = Object.keys(notes).length - 1;

            for(const key of Object.keys(notes)) {
                const actualTitle = $(allNotes[order]).find('h4').text().trim();
                const actualDescription = $(allNotes[order]).find('p').text().trim();

                expect(actualTitle).toEqual(notes[key].title);
                expect(actualDescription).toEqual(notes[key].description);
                order -= 1;
            }
        });

        test("TC_API_25: GET /notes returns 200 OK with All notes page - no notes", async () => {
            const res = await noteService.getAllNotesPage();

            const $ = load(res.text);

            // Check status and headers
            verifyStatusAndHeader(res, { checkCookie: false});

            /**
             * Check body
             * 1. Check greeting text
             * 2. Check no note notification
             * 3. Check "Create One!" button
             */

            const greetingText = $('h1').text().trim();
            expect(greetingText).toBeDefined();
            const noNoteNotice = $('p.lead').text().trim();
            expect(noNoteNotice).toBeDefined();
            const createNoteButton = $('div.card-body > a');
            expect(createNoteButton.length).toBeGreaterThan(0);

            expect(greetingText).toEqual("Hello admin");
            expect(noNoteNotice).toEqual("There are not Notes yet.");
            expect(createNoteButton.attr('href')).toEqual("/notes/add");
            expect(createNoteButton.text().trim()).toEqual("Create One!");
        });
    });

    describe("Get /notes route - not logged in", () => {
        let noteService;
        let res;

        beforeEach(async () => {
            await mongoose.connection.collection("notes").deleteMany({});
            noteService = new NoteService();
            res = await noteService.getAllNotesPage();
            console.log(res.text);
        });

        test("TC_API_26.01: GET /notes returns 302 Found redirect to /auth/signin", () => {
            // Check status and headers
            verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", location: "/auth/signin"});
        });

        test("TC_API_26.02: 'Not Authorized.' appears on sign in page when accessing All Notes without login", async () => {
            await verifyRedirectNonLoggedin(noteService, res);
        });
    });

    afterAll(async() => {
        await closeDB();
    });


});