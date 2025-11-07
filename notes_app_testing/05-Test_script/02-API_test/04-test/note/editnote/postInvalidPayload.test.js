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
import { verifyAllFieldsCorrect } from "../../../03-helpers/assertFieldsFormHelper.js"
import { createNoteSetup } from "../../../03-helpers/createNoteHelper.js";
import { baseUser } from "../../../../data/base_user.js";
import { noteData } from "../../../../data/noteAPI_data.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js";

describe("PUT /notes/edit-note/:id with invalid payload - logged in and owner", () => {
    beforeAll(async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    let noteID;
    let noteService;

    beforeEach( async () => {
        await mongoose.connection.collection("notes").deleteMany({});
        // Prepare for request
        /** 
         * Send request:
         * The same agent instance is shared between AuthService and NoteService,
         * so create a general agent and pass it to both.
        */
       const agent = request.agent(app);
       const authService = new AuthService(agent);
       await authService.submitSignInForm(baseUser.userA);
       noteService = new NoteService(agent);
       const note = (await createNoteSetup(noteService)).note1;
       noteID = note.id;
    });

    test("TC_API_31: Note update fails with 'Please Write a Title' when title is missing", async () => {
        const data = noteData.missingTitle.data;
        const res = await noteService.submitEditNoteForm(noteID, data);
        const $ = load(res.text);
        console.log(res.text);

        // Check status and headers
        verifyStatusAndHeader(res, { checkCookie: false });

        /**
         * Check body
         * 1. Check title to ensure that correct page is rendered.
         * 2. Check all fields retain submitted data.
         * 3. Check error messages displayed properly.
         */
        expect($('h3').text().trim()).toEqual("Edit Note");

        const expectedFields = ["Title:", "Description:"];
        verifyAllFieldsCorrect($, expectedFields, {data});

        const expectedMessages = ["Please Write a Title."];
        verifyMessageContent($, expectedMessages);
    });

    test("TC_API_32: Note update fails with 'Please Write a Description' when description is missing", async () => {
        const data = noteData.missingDescription.data;
        const res = await noteService.submitEditNoteForm(noteID, data);
        const $ = load(res.text);
        console.log(res.text);

        // Check status and headers
        verifyStatusAndHeader(res, { checkCookie: false });

        /**
         * Check body
         * 1. Check title to ensure that correct page is rendered.
         * 2. Check all fields retain submitted data.
         * 3. Check error messages displayed properly.
         */
        expect($('h3').text().trim()).toEqual("Edit Note");

        const expectedFields = ["Title:", "Description:"];
        verifyAllFieldsCorrect($, expectedFields, {data});

        const expectedMessages = ["Please Write a Description."];
        verifyMessageContent($, expectedMessages);
    });

    test("TC_API_33: Note update fails with 'Please Write a Title', 'Please Write a Description' when the both fields empty", async () => {
        const data = noteData.missingBothField.data;
        const res = await noteService.submitEditNoteForm(noteID, data);
        const $ = load(res.text);
        console.log(res.text);

        // Check status and headers
        verifyStatusAndHeader(res, { checkCookie: false });

        /**
         * Check body
         * 1. Check title to ensure that correct page is rendered.
         * 2. Check all fields retain submitted data.
         * 3. Check error messages displayed properly.
         */
        expect($('h3').text().trim()).toEqual("Edit Note");

        const expectedFields = ["Title:", "Description:"];
        verifyAllFieldsCorrect($, expectedFields, {data});

        const expectedMessages = ["Please Write a Title.", "Please Write a Description."];
        verifyMessageContent($, expectedMessages);
    });

    afterAll( async () => {
        await closeDB();
    });
});