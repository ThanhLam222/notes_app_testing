import { describe, test, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";
import { load } from "cheerio";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../../../../../notes_app/src/app.js";
import { AuthService } from "../../../01-SOM/authService.js";
import { NoteService } from "../../../01-SOM/noteService.js"
import { connectDB, closeDB } from "../../../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { verifyMessageContent } from "../../../03-helpers/assertMessageHelper.js";
import { verifyAllFieldsCorrect } from "../../../03-helpers/assertFieldsFormHelper.js";
import { baseUser } from "../../../../data/base_user.js";
import { noteData } from "../../../../data/noteAPI_data.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js";

describe("POST /notes/new-note with invalid payload - logged in", () => {
    beforeAll(async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    let noteService;
    let agent;

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

    test("TC_API_20: Note creation fails with 'Please Write a Title' when title is missing", async () => {
        const noteInput = noteData.missingTitle.data;
        const res = await noteService.submitNewNoteForm(noteInput);
        const $ = load(res.text);

        // Check status and headers
        verifyStatusAndHeader(res, { checkCookie: false});

        /**
         * Check body
         * 1. Check title to ensure redirection to correct page
         * 2. Check error messages displayed properly
         * 3. Check form fields retain the submitted values
         */
        expect($('h3').text().trim()).toEqual("New Note");

        const expectedMessages = ["Please Write a Title."];
        verifyMessageContent($, expectedMessages);
        
        const expectedFields = ["Title:", "Description:"];
        verifyAllFieldsCorrect($, expectedFields, noteInput);
    });

    test("TC_API_21: Note creation fails with 'Please Write a Description' when description is missing", async () => {
        const noteInput = noteData.missingDescription.data;
        const res = await noteService.submitNewNoteForm(noteInput);
        const $ = load(res.text);

        // Check status and headers
        verifyStatusAndHeader(res, { checkCookie: false});

        /**
         * Check body
         * 1. Check title to ensure redirection to correct page
         * 2. Check error messages displayed properly
         * 3. Check form fields retain the submitted values
         */
        expect($('h3').text().trim()).toEqual("New Note");

        const expectedMessages = ["Please Write a Description."];
        verifyMessageContent($, expectedMessages);
        
        const expectedFields = ["Title:", "Description:"];
        verifyAllFieldsCorrect($, expectedFields, noteInput);
    });

    test("TC_API_22: Note creation fails with 'Please Write a Title.',  'Please Write a Description' when the both fields empty", async () => {
        const noteInput = noteData.missingBothField.data;
        const res = await noteService.submitNewNoteForm(noteInput);
        const $ = load(res.text);

        // Check status and headers
        verifyStatusAndHeader(res, { checkCookie: false});

        /**
         * Check body
         * 1. Check title to ensure redirection to correct page
         * 2. Check error messages displayed properly
         * 3. Check form fields retain the submitted values
         */
        expect($('h3').text().trim()).toEqual("New Note");

        const expectedMessages = ["Please Write a Title.","Please Write a Description."];
        verifyMessageContent($, expectedMessages);
        
        const expectedFields = ["Title:", "Description:"];
        verifyAllFieldsCorrect($, expectedFields, noteInput);
    });

    afterAll( async () => {
        await closeDB();
    });
});