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
import { verifyNoteContent } from "../../../03-helpers/assertNoteContentHelper.js";
import { baseUser } from "../../../../data/base_user.js";
import { noteData } from "../../../../data/noteAPI_data.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js";

describe("POST /notes/new-note with valid payload - logged in", () => {
    beforeAll(async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    let noteService;
    let res;
    let agent;
    let noteInput;

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
       noteInput = noteData.valid.data;
       res = await noteService.submitNewNoteForm(noteInput);
    });

    test("TC_API_19.01: Successful note creation returns 302 Found redirect to /notes", () => {
        // Check status and headers
        verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", checkCookie: false, location: "/notes"});
    });

    test("TC_API_19.02: 'Note Added Successfully' appears after note creation succeeds", async () => {
        const location = res.headers.location;
        expect(location).toBeDefined();
        const redirectRes = await agent.get(location);
        const $ = load(redirectRes.text);

        // Check status and headers
        verifyStatusAndHeader(redirectRes, { checkCookie: false});

        /**
         * Check body
         * 1. Check title and description of notes
         * 2. Check messages to ensure success message displayed properly
         */
        verifyNoteContent($, {data: noteInput});

        const expectedMessages = ["Note Added Successfully"];
        verifyMessageContent($, expectedMessages);
    });

    afterAll( async () => {
        await closeDB();
    });
});