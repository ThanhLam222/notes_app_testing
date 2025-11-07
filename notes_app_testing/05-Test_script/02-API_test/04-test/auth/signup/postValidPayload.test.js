import { describe, test, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { load } from "cheerio";
import { AuthService } from "../../../01-SOM/authService.js";
import { connectDB, closeDB } from "../../../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { verifyMessageContent } from "../../../03-helpers/assertMessageHelper.js";
import { signUpData } from "../../../../data/signupAPI_data.js";

describe("POST /auth/signup with valid playload", () => {
    let authService;
    let res;

    beforeAll(async () => {
        await connectDB();
    });

    beforeEach(async () => {
        await mongoose.connection.collection("users").deleteMany({});

        authService = new AuthService();
        res = await authService.submitSignUpForm(signUpData.valid.data);
    });

    test("TC_API_02.01:  A successful signup returns 302 Found redirect to /auth/signin", () => {
        verifyStatusAndHeader(res, {expectedStatus: 302, type: "redirect", location: "/auth/signin"});
    });

    test("TC_API_02.02: Message 'You are registered' appears after successful signup", async () => {
        const location = res.headers.location;
        expect(location).toBeDefined();
        const agent = authService.agent;
        const redirectRes = await agent.get(location);

        // Check response status and headers
        verifyStatusAndHeader(redirectRes, {checkCookie: false});

        /**
         *  Check body of response
         * 1. Check title to ensure redirected to correct URL
         * 2. Check messages to ensure success message displayed
         */

        const $ = load(redirectRes.text);
        expect($('h1').text().trim()).toEqual("Account Login");

        const expectedMessages = ["You are registered."];

        verifyMessageContent($, expectedMessages);
    });

    afterAll( async () => {
        await closeDB();
    });
});
