import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import { connectDB, closeDB } from "../../../02-API_test/02-ultils/mongoServerUtil.js";
import User from "../../../../../notes_app/src/models/User.js";
import { verifyValidationErrorCorrect } from "../../01-helpers/validationErrorHelper.js";
import { userData } from "../../../data/userDB_data.js";
import { createAdminUser } from "../../../../../notes_app/src/libs/createUser.js";


describe("Failed to create user", () => {
    beforeAll( async () => {
        await connectDB();
    });

    beforeEach( async () => {
        await mongoose.connection.collection("users").deleteMany({});
    });

    test("TC_DB_05: Fail to create user when email missing", async () => {
        let error;
        const data = userData.missingEmail.data;

        try {
            const user = await new User(data).save();
        } catch (err) {
            error = err;
        }

        verifyValidationErrorCorrect(error, "email");
    });

    test("TC_DB_06: Fail to create user when password missing", async () => {
        let error;
        const data = userData.missingPassword.data;

        try {
            const user = await new User(data).save();
        } catch (err) {
            error = err;
        }

        verifyValidationErrorCorrect(error, "password");
    });

    test("TC_DB_07: Fail to create user when email existing", async () => {
        await createAdminUser();

        let error;
        const data = userData.existingEmail.data;

        try {
            const user = await new User(data).save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.name).toEqual("MongoServerError");
        expect(error.code).toEqual(11000);
        expect(error.keyValue.email).toEqual("admin@localhost");
    });

    test("TC_DB_08: Fail to create user when password is too short", async () => {

        let error;
        const data = userData.shortPassword.data;

        try {
            const user = await new User(data).save();
        } catch (err) {
            error = err;
        }

        verifyValidationErrorCorrect(error, "password", "minlength");
    });

    test("TC_DB_09: Fail to create user when email is invalid format", async () => {

        let error;
        const data = userData.invalidEmail.data;

        try {
            const user = await new User(data).save();
        } catch (err) {
            error = err;
        }

        verifyValidationErrorCorrect(error, "email", "user defined");
    });


    afterAll( async () => {
        await closeDB();
    });

});