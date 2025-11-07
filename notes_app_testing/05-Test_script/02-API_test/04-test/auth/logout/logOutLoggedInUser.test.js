import { describe, test, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";
import { load } from "cheerio";
import mongoose from "mongoose";
import { AuthService } from "../../../01-SOM/authService.js";
import { NoteService } from "../../../01-SOM/noteService.js";
import { connectDB, closeDB } from "../../../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { verifyMessageContent } from "../../../03-helpers/assertMessageHelper.js";
import { baseUser } from "../../../../data/base_user.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js";

describe("GET /auth/logout route -logged in user", () => {
    beforeAll( async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    let res;
    let authService;
    let cookieLoggedIn;

    beforeEach(async () => {
        /**
         * Prepare for test:
         * - Sign in with user
         * - Save set-cookie of sign in request to use for test
         */

        authService = new AuthService();
        const resLoggedIn = await authService.submitSignInForm(baseUser.userA);
        cookieLoggedIn = resLoggedIn.headers["set-cookie"];

        // Send logout request
        res = await authService.logout();
    });

    test("TC_API_41.01: Successful log out returns 302 Found redirect to /auth/signin", () => {
        // Check status and headers
        verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", location: "/auth/signin"});
    });

    test("TC_API_41.02:  'You are logged out now.' appears after logout succeeds", async () => {
        const agent = authService.agent;
        const location = res.headers.location;
        expect(location).toBeDefined();

        const redirectRes = await agent.get(location);
        const $ = load(redirectRes.text);

        // Check status and headers
        verifyStatusAndHeader(redirectRes, { checkCookie: false});

        /**
         * Check body
         * 1. Verify page title to ensure redirection to the correct page.
         * 2. Verify success messages are displayed properly.
         */
        expect($('h1').text().trim()).toEqual("Account Login");

        const expectedMessages = ["You are logged out now."];
        verifyMessageContent($, expectedMessages);
    });

    test("TC_API_41.03: Session ID is renewed after log out succeeds", () => {
        const cookieAfterLogout = res.headers["set-cookie"];
        console.log(cookieLoggedIn);
        console.log(cookieAfterLogout);

        expect(cookieLoggedIn).not.toEqual(cookieAfterLogout);
    });

    test("TC_API_41.04: Session ID is invalidated after log out succeeds", async () => {
        const agent = authService.agent;
        const noteService = new NoteService(agent);

        const res = await noteService.getAllNotesPage();

        // Check status and headers
        verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", checkCookie: false, location: "/auth/signin"});
    });

    afterAll(async() => {
        await closeDB();
    });

})