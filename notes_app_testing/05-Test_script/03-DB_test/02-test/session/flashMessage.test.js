import { test, expect } from "@jest/globals";
import mongoose from "mongoose";
import { AuthService } from "../../../02-API_test/01-SOM/authService.js";
import { connectDB, closeDB } from "../../../02-API_test/02-ultils/mongoServerUtil.js";
import { baseUser } from "../../../data/base_user.js";
import { createAdminUser } from "../../../../../notes_app/src/libs/createUser.js";

test("TC_DB_23: Flash message is supported", async () => {
    /**
     * Prepare for test
     * 1. Set up database
     * 2. Clean users, sessions and notes collection from database to have a fresh database
     * 3. Save an user to database
     * 4. Log in
     */
    await connectDB();
    await mongoose.connection.collection("users").deleteMany({});
    await mongoose.connection.collection("sessions").deleteMany({});
    await mongoose.connection.collection("notes").deleteMany({});
    await createAdminUser();

    // Log in
    const authService = new AuthService();
    await authService.submitSignInForm(baseUser.userA);
    
    /**
     * Perform test:
     * 1. Log out
     * 2. Get sessionID from log out response
     * 3. Query session by sessionID to verify that flash message is saved: parse sessionDoc.session from JSON to object
     */
    const res = await authService.logout();

    const setCookie = res.headers["set-cookie"][0];
    console.log(setCookie);
    expect(setCookie).toBeDefined();
    const sessionID = setCookie.split(";")[0]
                               .replace("connect.sid=s%3A", "")
                               .split(".")[0]; 

    const sessionDoc = await mongoose.connection.collection("sessions").findOne({ _id: sessionID });
    expect(sessionDoc).toBeDefined();

    const sessionData = JSON.parse(sessionDoc.session);
    const flashMessage = sessionData.flash["success_msg"];
    expect(flashMessage).toBeDefined();
    expect(flashMessage).toEqual(["You are logged out now."]);

    // Teardown database
    await closeDB();
});