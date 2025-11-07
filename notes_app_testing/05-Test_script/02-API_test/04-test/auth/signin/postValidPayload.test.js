import { describe, test, expect, beforeAll, beforeEach, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { AuthService } from "../../../01-SOM/authService.js";
import { connectDB, closeDB } from "../../../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { signInData } from "../../../../data/signinAPI_data.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js";

describe("POST /auth/signin with valid payload", () => {
    let data;
    let authService;

    beforeAll( async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    beforeEach( async () => {
        data = signInData.valid.data;
        authService = new AuthService();
    });

    test("TC_API_11: A successful sign in returns 302 Found redirect to /notes", async () => {
        res = await authService.submitSignInForm(data);

        // Check status and headers
        verifyStatusAndHeader(res, {expectedStatus: 302, type: "redirect", location: "/notes"});
    });

    test("TC_API_12: Session ID is renewed after new sign-in", async () => {
        res = await authService.getSignInForm();
        const cookieBeforeLogin = res.headers['set-cookie'];
        expect(cookieBeforeLogin).toBeDefined();

        const resSignIn = await authService.submitSignInForm(data);
        const cookieAfterLogin = resSignIn.headers['set-cookie'];
        expect(cookieAfterLogin).toBeDefined();
        expect(cookieBeforeLogin).not.toEqual(cookieAfterLogin);
    });

    afterAll( async() => {
        await closeDB();
    });
});