import { describe, test, beforeAll, beforeEach, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { AuthService } from "../../../01-SOM/authService.js";
import { connectDB, closeDB } from "../../../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { verifyRedirectNonLoggedin } from "../../../03-helpers/redirectNonLoggedIn.js";
import { createAdminUser } from "../../../../../../notes_app/src/libs/createUser.js";

describe("GET /auth/logout - non-logged in user", () => {
    beforeAll( async () => {
        await connectDB();
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    let authService;
    let res;

    beforeEach(async () => {
        authService = new AuthService();
        res = await authService.logout();
    });

    test("TC_API_42.01: Failed logout returns 302 Found redirect to /auth/signin", () => {
        // Check status and headers
        verifyStatusAndHeader(res, { expectedStatus: 302, type: "redirect", location: "/auth/signin"});
    });

    test("TC_API_42.02: 'Not Authorized.' appears after logout attempt without login", async () => {
        await verifyRedirectNonLoggedin(authService, res);
    });

    afterAll(async() => {
        await closeDB();
    });
});