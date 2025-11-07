import { describe, test, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { load } from "cheerio";
import { AuthService } from "../../../01-SOM/authService.js";
import { connectDB, closeDB } from "../../../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { verifyMessageContent } from "../../../03-helpers/assertMessageHelper.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js"
import { signInData } from "../../../../data/signinAPI_data.js";

describe("POST /auth/signin with invalid payload", () => {
    beforeAll( async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    describe("POST /auth/signin with empty email field", () => {
        let authService;
        let res;

        beforeEach( async () => {
            const data = signInData.missingEmail.data;
            authService = new AuthService();
            res = await authService.submitSignInForm(data);
        });

        test("TC_API_13.01: Sign in returns 302 Found redirect to /auth/signin when email field is missing", async () => {
            // Check status and headers
            verifyStatusAndHeader(res, {expectedStatus: 302, type: "redirect", location: "/auth/signin"});
        });

        test("TC_API_13.02: 'Missing credentials' appears after sign in fails", async () => {
            const agent = authService.agent;
            const location = res.headers.location;
            expect(location).toBeDefined();

            const redirectRes = await agent.get(location);

            // Check status and headers
            verifyStatusAndHeader(redirectRes, { checkCookie: false});

            /**
             * Check body
             * 1. Check title to ensure redirection to correct URL
             * 2. Check Check messages to ensure success message displayed 
             */
            const $ = load(redirectRes.text);

            expect($('h1').text().trim()).toEqual("Account Login");

            const expectedMessages = ["Missing credentials"];
            verifyMessageContent($, expectedMessages);
        });
    });

    describe("POST /auth/signin with empty password field", () => {
        let authService;
        let res;

        beforeEach( async () => {
            const data = signInData.missingPassword.data;
            authService = new AuthService();
            res = await authService.submitSignInForm(data);
        });

        test("TC_API_14.01: Sign in returns 302 Found redirect to /auth/signin when password field is missing", async () => {
            // Check status and headers
            verifyStatusAndHeader(res, {expectedStatus: 302, type: "redirect", location: "/auth/signin"});
        });

        test("TC_API_14.02: 'Missing credentials' appears after sign in fails", async () => {
            const agent = authService.agent;
            const location = res.headers.location;
            expect(location).toBeDefined();

            const redirectRes = await agent.get(location);

            // Check status and headers
            verifyStatusAndHeader(redirectRes, { checkCookie: false});

            /**
             * Check body
             * 1. Check title to ensure redirection to correct URL
             * 2. Check Check messages to ensure success message displayed 
             */
            const $ = load(redirectRes.text);

            expect($('h1').text().trim()).toEqual("Account Login");

            const expectedMessages = ["Missing credentials"];
            verifyMessageContent($, expectedMessages);
        });
    });

    describe("POST /auth/signin with incorrect email", () => {
        let authService;
        let res;

        beforeEach( async () => {
            const data = signInData.incorrectEmail.data;
            authService = new AuthService();
            res = await authService.submitSignInForm(data);
        });

        test("TC_API_15.01: Sign in returns 302 Found redirect to /auth/signin when email is incorrect", async () => {
            // Check status and headers
            verifyStatusAndHeader(res, {expectedStatus: 302, type: "redirect", location: "/auth/signin"});
        });

        test("TC_API_15.02: 'Not User found.' appears after sign in fails", async () => {
            const agent = authService.agent;
            const location = res.headers.location;
            expect(location).toBeDefined();

            const redirectRes = await agent.get(location);

            // Check status and headers
            verifyStatusAndHeader(redirectRes, { checkCookie: false});

            /**
             * Check body
             * 1. Check title to ensure redirection to correct URL
             * 2. Check Check messages to ensure success message displayed 
             */
            const $ = load(redirectRes.text);

            expect($('h1').text().trim()).toEqual("Account Login");

            const expectedMessages = ["Not User found."];
            verifyMessageContent($, expectedMessages);
        });
    });

    describe("POST /auth/signin with incorrect password", () => {
        let authService;
        let res;

        beforeEach( async () => {
            const data = signInData.incorrectPassword.data;
            authService = new AuthService();
            res = await authService.submitSignInForm(data);
        });

        test("TC_API_16.01: Sign in returns 302 Found redirect to /auth/signin when when password is incorrect", async () => {
            // Check status and headers
            verifyStatusAndHeader(res, {expectedStatus: 302, type: "redirect", location: "/auth/signin"});
        });

        test("TC_API_16.02: 'Incorrect Password.' appears after sign in fails", async () => {
            const agent = authService.agent;
            const location = res.headers.location;
            expect(location).toBeDefined();

            const redirectRes = await agent.get(location);

            // Check status and headers
            verifyStatusAndHeader(redirectRes, { checkCookie: false});

            /**
             * Check body
             * 1. Check title to ensure redirection to correct URL
             * 2. Check Check messages to ensure success message displayed 
             */
            const $ = load(redirectRes.text);

            expect($('h1').text().trim()).toEqual("Account Login");

            const expectedMessages = ["Incorrect Password."];
            verifyMessageContent($, expectedMessages);
        });
    });

    afterAll( async() => {
        await closeDB();
    });
});