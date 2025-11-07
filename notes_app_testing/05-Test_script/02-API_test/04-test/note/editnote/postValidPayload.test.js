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
import { createNoteSetup } from "../../../03-helpers/createNoteHelper.js";
import { baseUser } from "../../../../data/base_user.js";
import { noteData } from "../../../../data/noteAPI_data.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js";

describe("PUT /notes/edit-note/:id with valid payload - logged in and owner", () => {
    beforeAll(async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    let agent;
    let noteID;
    let noteInput;
    let res;

    beforeEach( async () => {
        await mongoose.connection.collection("notes").deleteMany({});
        // Prepare for request
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
       noteID = note.id;
       noteInput = noteData.valid.data;

       // Send request
       res = await noteService.submitEditNoteForm(noteID, noteInput);
    });

    test("TC_API_30.01: Successful note update returns 302 Found redirect to /notes", () => {
        // Check status and headers
        verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", checkCookie: false, location: "/notes"});
    });

    test("TC_API_30.02: 'Note Updated Successfully' appears after successful note update", async () => {
        const location = res.headers.location;
        expect(location).toBeDefined();

        const redirectRes = await agent.get(location);
        const $ = load(redirectRes.text);

        // Check status and headers
        verifyStatusAndHeader(redirectRes, { checkCookie: false });

        /**
         * Check body: 
         * Get the updated note by its ID to verify only this specific note instead of checking all notes.
         * 
         * 1. Verify that the title and description are updated correctly.
         * 2. Verify that the success message is displayed properly.
         */

        const updatedNote = $(`div.card-body:has(a[href="/notes/edit/${noteID}"])`);
        expect(updatedNote.find('h4').text().trim()).toEqual(noteInput.title);
        expect(updatedNote.find('p').text().trim()).toEqual(noteInput.description);

        const expectedMessages = ["Note Updated Successfully"];
        verifyMessageContent($, expectedMessages);
    });

    afterAll( async () => {
        await closeDB();
    });
});