import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import { AuthService } from "../../../02-API_test/01-SOM/authService.js";
import { connectDB, closeDB } from "../../../02-API_test/02-ultils/mongoServerUtil.js";
import { signInData } from "../../../data/signinAPI_data.js";
import { createAdminUser } from "../../../../../notes_app/src/libs/createUser.js";

describe("Save session correctly into database", () => {
    beforeAll( async () => {
        await connectDB();
    });

    beforeEach( async () => {
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("sessions").deleteMany({});
        await createAdminUser();
    });

    test("TC_DB_10: User session is stored in MongoDB after login succeeds via API", async () => {
        /**
         * Prepare for test
         * 1. Query id of user to use for test
         * 2. Sign in with valid user
         * 3. Save set-cookie to get sessionID to use for test.
         */
        const userID = (await mongoose.connection.collection("users").findOne({email: "admin@localhost"}))._id.toString();

        const authService = new AuthService();
        const res = await authService.submitSignInForm(signInData.valid.data);
        const setCookie = res.headers["set-cookie"][0];
        expect(setCookie).toBeDefined();

        const sessionID = setCookie.split(";")[0]
                                    .replace("connect.sid=s%3A", "")
                                    .split(".")[0];
        /**
         * Perform test:
         * 1. Query the session document using the sessionID.
         * 2. Verify that the cookie has not expired: change date to number to compare
         * 3. Verify that the session contains the correct user ID: parse sessionDoc.session from JSON to object
         */
        const sessionDoc = await mongoose.connection.collection("sessions").findOne({ _id: sessionID });
        expect(new Date(sessionDoc.expires).getTime(Date.now()));

        const sessionData = JSON.parse(sessionDoc.session);
        expect(sessionData.passport.user).toEqual(userID);
    });

    test("TC_DB_11: User session is not stored in MongoDB after login fails via API", async () => {
        /**
         * Prepare for test
         * 1. Sign in with invalid user
         * 2. Save set-cookie to get sessionID to use for test.
         */

        const authService = new AuthService();
        const res = await authService.submitSignInForm(signInData.incorrectPassword.data);
        const setCookie = res.headers["set-cookie"][0];
        expect(setCookie).toBeDefined();

        const sessionID = setCookie.split(";")[0]
                                    .replace("connect.sid=s%3A", "")
                                    .split(".")[0];
        /**
         * Perform test:
         * 1. Query the session document using the sessionID.
         * 2. Verify that the session don't bind to any user: parse sessionDoc.session from JSON to object
         */
        const sessionDoc = await mongoose.connection.collection("sessions").findOne({ _id: sessionID });

        const sessionData = JSON.parse(sessionDoc.session);
        expect(sessionData.passport).toBeUndefined();
    });

    afterAll( async () => {
        await closeDB();
    });


});