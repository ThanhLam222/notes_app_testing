import { test, expect } from "@jest/globals";
import mongoose from "mongoose";
import { AuthService } from "../../../02-API_test/01-SOM/authService.js";
import { connectDB, closeDB } from "../../../02-API_test/02-ultils/mongoServerUtil.js";
import { baseUser } from "../../../data/base_user.js";
import { createAdminUser } from "../../../../../notes_app/src/libs/createUser.js";

test("TC_DB_22: Session termination after log out", async () => {
    /**
     * Prepare for test
     * 1. Set up database
     * 2. Clean users, sessions and notes collection from database to have a fresh database
     * 3. Save an user to database
     * 4. Log in and save sessionID to verify session terminate after log out
     */
    await connectDB();
    await mongoose.connection.collection("users").deleteMany({});
    await mongoose.connection.collection("sessions").deleteMany({});
    await mongoose.connection.collection("notes").deleteMany({});
    await createAdminUser();

    // Log in
    const authService = new AuthService();
    const res = await authService.submitSignInForm(baseUser.userA);

    const setCookie = res.headers["set-cookie"][0];
    console.log(setCookie);
    expect(setCookie).toBeDefined();
    const sessionID = setCookie.split(";")[0]
                               .replace("connect.sid=s%3A", "")
                               .split(".")[0];
    
    /**
     * Perform test:
     * 1. Log out
     * 2. Query session document by sessionID from sign in response
     * 3. Verify that this session no longer exists in the database
     */
    await authService.logout();

    const sessionDoc = await mongoose.connection.collection("sessions").findOne({ _id: sessionID });
    expect(sessionDoc).toBeNull();

    // Teardown database
    await closeDB();
});