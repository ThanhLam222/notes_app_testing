import { describe, test, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";
import { load } from "cheerio";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../../../../../notes_app/src/app.js";
import { AuthService } from "../../../01-SOM/authService.js";
import { NoteService } from "../../../01-SOM/noteService.js"
import { connectDB, closeDB } from "../../../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { verifyAllFieldsCorrect } from "../../../03-helpers/assertFieldsFormHelper.js";
import { verifyRedirectNonLoggedin } from "../../../03-helpers/redirectNonLoggedIn.js";
import { baseUser } from "../../../../data/base_user.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js";


describe("GET /notes/add routes", () => {
    beforeAll( async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    test("TC_API_17: GET /notes/add returns 200 OK with New note page when logged in", async () => {
        /** 
         * Send request:
         * The same agent instance is shared between AuthService and NoteService,
         * so create a general agent and pass it to both.
        */
       const agent = request.agent(app);
       const authService = new AuthService(agent);
       const noteService = new NoteService(agent);

       await authService.submitSignInForm(baseUser.userA);
       const res = await noteService.getNewNoteForm();

       // Check status and headers
       verifyStatusAndHeader(res, { checkCookie: false});

       /**
        * Check body
        * 1. Check page's title
        * 2. Check form fields
        * 3. Check Save button
        */

       const $ = load(res.text)
       expect($('h3').text().trim()).toEqual("New Note");

       const form = $('form');
       expect(form.attr('action')).toEqual("/notes/new-note");
       expect(form.attr('method')).toEqual("POST");

       const expectedName = ["Title:", "Description:"];
       verifyAllFieldsCorrect($, expectedName);

       const saveButton = $('form > button');
       expect(saveButton.length).toBeGreaterThan(0);
       expect(saveButton.text().trim()).toEqual("Save");

    });

    describe("GET /notes/add - not logged in", () => {
        let noteService;
        let res;

        beforeEach(async () => {
            noteService = new NoteService();
            res = await noteService.getNewNoteForm();
        });

        test("TC_API_18.01: GET /notes/add returns 302 Found redirect to /auth/signin when not logged-in", () => {
            // Check status and headers
            verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", location: "/auth/signin"});
        })

        test("TC_API_18.02: 'Not Authorized.' appears on sign in page when accessing New Note without login", async () => {
            await verifyRedirectNonLoggedin(noteService, res);
        });
    });

    afterAll(async () => {
        await closeDB();
    });
});