import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB, closeDB } from "../../../02-API_test/02-ultils/mongoServerUtil.js";
import User from "../../../../../notes_app/src/models/User.js";
import { AuthService } from "../../../02-API_test/01-SOM/authService.js";
import { userData } from "../../../data/userDB_data.js";
import { signUpData } from "../../../data/signupAPI_data.js";

describe("Hash password", () => {
    beforeAll( async () => {
        await connectDB();
    });

    beforeEach( async () => {
        await mongoose.connection.collection("users").deleteMany({});
    });

    test("TC_DB_24: Password is hashed before saved to database when user sign up successfully via Mongoose directly", async () => {
        const data = userData.validHasName.data;
        const user = await new User(data).save();

        expect(user.password).not.toEqual(data.password);

        const hash = await bcrypt.compare(data.password, user.password);
        expect(hash).toBeTruthy();
    });

    test("TC_DB_25: Password is hashed before saved to database when user sign up successfully via API request", async () => {
        /**
         * 1. Sign up via API with valid payload
         * 2. Query user from database
         * 3. Verify whether password is hashed or not
         */
        const data = signUpData.valid.data;
        const authService = new AuthService();

        await authService.submitSignUpForm(data);

        const user = await User.findOne({email: data.email});
        console.log(user);
        expect(user.password).not.toEqual(data.password);

        const hash = await bcrypt.compare(data.password, user.password);
        expect(hash).toBeTruthy();
    });
    
    afterAll( async () => {
        await closeDB();
    });
});