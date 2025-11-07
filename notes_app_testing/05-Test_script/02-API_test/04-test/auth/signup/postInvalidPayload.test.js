import { describe, test, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { load } from "cheerio";
import { AuthService } from "../../../01-SOM/authService.js";
import { connectDB, closeDB } from "../../../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { verifyMessageContent } from "../../../03-helpers/assertMessageHelper.js";
import { verifyAllFieldsCorrect } from "../../../03-helpers/assertFieldsFormHelper.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js"
import { signUpData } from "../../../../data/signupAPI_data.js";

describe("POST /auth/signup with invalid playload", () => {

    beforeAll(async () => {
        await connectDB();
    });

    beforeEach(async () => {
        await mongoose.connection.collection("users").deleteMany({});
    });

    describe("POST /auth/signup with missing fields", () => {
        let authService;

        beforeEach(() => {
            authService = new AuthService();
        });

        test("TC_API_03: Signup fails with an error when the email field is missing", async () => {
            const data = signUpData.missingEmail.data;
            const res = await authService.submitSignUpForm(data);
            const $ = load(res.text);

            // Check status code and headers
            verifyStatusAndHeader(res);

           /**
            * Check body
            * 1. Check title to ensured render correct HTML.
            * 2. Check form fields retain the submitted values.
            * 3. Check error messages are displayed properly.
            * 
            */

            expect($('h4').text().trim()).toEqual("Account Register");

            const expectedFields = ["Name:", "Email:", "Password:", "Confirm Password:"];
            verifyAllFieldsCorrect($, expectedFields, data);

            const expectedMessages = ["Please fill out all required fields (email/password/confirm password)"];
            verifyMessageContent($, expectedMessages);
        });

        test("TC_API_04: Signup fails with an error when the password field is missing", async () => {
            const data = signUpData.missingPassword.data;
            const res = await authService.submitSignUpForm(data);
            const $ = load(res.text);

            // Check status code and headers
            verifyStatusAndHeader(res);

           /**
            * Check body
            * 1. Check title to ensured render correct HTML.
            * 2. Check form fields retain the submitted values.
            * 3. Check error messages are displayed properly.
            * 
            */

            expect($('h4').text().trim()).toEqual("Account Register");

            const expectedFields = ["Name:", "Email:", "Password:", "Confirm Password:"];
            verifyAllFieldsCorrect($, expectedFields, data);

            const expectedMessages = ["Please fill out all required fields (email/password/confirm password)"];
            verifyMessageContent($, expectedMessages);
        });

        test("TC_API_05: Signup fails with an error when the confirm password field is missing", async () => {
            const data = signUpData.missingConfirmPassword.data;
            const res = await authService.submitSignUpForm(data);
            const $ = load(res.text);

            // Check status code and headers
            verifyStatusAndHeader(res);

           /**
            * Check body
            * 1. Check title to ensured render correct HTML.
            * 2. Check form fields retain the submitted values.
            * 3. Check error messages are displayed properly.
            * 
            */

            expect($('h4').text().trim()).toEqual("Account Register");

            const expectedFields = ["Name:", "Email:", "Password:", "Confirm Password:"];
            verifyAllFieldsCorrect($, expectedFields, data);

            const expectedMessages = ["Please fill out all required fields (email/password/confirm password)"];
            verifyMessageContent($, expectedMessages);
        });
    });

    describe("POST /auth/signup with existing email", () => {
        let authService;
        let res;


        beforeEach(async () => {
            await createAdminUser();

            authService = new AuthService();

            const data = signUpData.emailExisting.data;
            res = await authService.submitSignUpForm(data);
        });

        test("TC_API_06.01: Signup returns 302 Found redirect to /auth/signup when email already exists", () => {
            // Check status and headers
            verifyStatusAndHeader(res, {expectedStatus: 302, type: "redirect", location: "/auth/signup"});
        });

        test("TC_API_06.02: Signup fails with 'Email is already in use.' message for existing email", async () => {
            const agent = authService.agent;
            const location = res.headers.location;
            expect(location).toBeDefined();
            const redirectRes = await agent.get(location);

            // Check status and headers
            verifyStatusAndHeader(redirectRes, {checkCookie: false});

            /**
             * Check body
             * 1. Verify title page to ensure redirection to the correct URL.
             * 2. Verify all input fields are cleared.
             * 3. Verify error messages are displayed properly.
             */

            const $ = load(redirectRes.text);
            expect($('h4').text().trim()).toEqual("Account Register");

            const expectedFields = ["Name:", "Email:", "Password:", "Confirm Password:"];
            verifyAllFieldsCorrect($, expectedFields, {name: "", email: "", password: "", confirm_password: ""});

            const expectedMessages = ["The Email is already in use."];
            verifyMessageContent($, expectedMessages);
        });
    });

    describe("POST /auth/signup with password errors", () => {
        let authService;

        beforeEach(() => {
            authService = new AuthService();
        });

        test("TC_API_07: Signup fails with 'Password must be at least 4 characters.' when password too short", async () => {
            const data = signUpData.shortPassword.data;
            const res = await authService.submitSignUpForm(data);

            // Check status and headers
            verifyStatusAndHeader(res);

            /**
             * Check body
             * 1. Verify title page to ensure redirection to the correct URL.
             * 2. Verify all input fields are cleared.
             * 3. Verify error messages are displayed properly.
             */

            const $ = load(res.text);
            expect($('h4').text().trim()).toEqual("Account Register");

            const expectedFields = ["Name:", "Email:", "Password:", "Confirm Password:"];
            verifyAllFieldsCorrect($, expectedFields, data);

            const expectedMessages = ["Passwords must be at least 4 characters."];
            verifyMessageContent($, expectedMessages);
        });

        test("TC_API_08: Signup fails  with 'Passwords do not match' when confirm password mismatches", async () => {
            const data = signUpData.mismatchPassword.data;
            const res = await authService.submitSignUpForm(data);

            // Check status and headers
            verifyStatusAndHeader(res);

            /**
             * Check body
             * 1. Verify title page to ensure redirection to the correct URL.
             * 2. Verify all input fields are cleared.
             * 3. Verify error messages are displayed properly.
             */

            const $ = load(res.text);
            expect($('h4').text().trim()).toEqual("Account Register");

            const expectedFields = ["Name:", "Email:", "Password:", "Confirm Password:"];
            verifyAllFieldsCorrect($, expectedFields, data);

            const expectedMessages = ["Passwords do not match."];
            verifyMessageContent($, expectedMessages);
        });

        test("TC_API_09: Signup fails with 'Invalid email address' when email format is invalid", async () => {
            const data = signUpData.invalidEmail.data;
            const res = await authService.submitSignUpForm(data);

            // Check status and headers
            verifyStatusAndHeader(res);

            /**
             * Check body
             * 1. Verify title page to ensure redirection to the correct URL.
             * 2. Verify all input fields are cleared.
             * 3. Verify error messages are displayed properly.
             */

            const $ = load(res.text);
            expect($('h4').text().trim()).toEqual("Account Register");

            const expectedFields = ["Name:", "Email:", "Password:", "Confirm Password:"];
            verifyAllFieldsCorrect($, expectedFields, data);

            const expectedMessages = ["Email address is invalid."];
            verifyMessageContent($, expectedMessages);
        });


    })

    afterAll( async () => {
        await closeDB();
    });
});