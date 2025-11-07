import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import { connectDB, closeDB } from "../../../02-API_test/02-ultils/mongoServerUtil.js";
import { verifySaveDocumentCorrectly } from "../../01-helpers/saveDataCorrectHelper.js";
import User from "../../../../../notes_app/src/models/User.js";
import { userData } from "../../../data/userDB_data.js";

describe("User created successfully", () => {
    beforeAll( async () => {
        await connectDB();
    });

    beforeEach( async () => {
        await mongoose.connection.collection("users").deleteMany({});
    });

    test("TC_DB_01: Create user successfully with all valid sign up fields (name field filled)", async () => {
        const data = userData.validHasName.data;
        const user = await new User(data).save();

        verifySaveDocumentCorrectly(user, data);
    });

    test("TC_DB_02:  Create user successfully with all valid sign up fields (name field empty)", async () => {
        const data = userData.validNoName.data;
        const user = await new User(data).save();

        verifySaveDocumentCorrectly(user, data);
    });

    test("TC_DB_03:  createdAt and updatedAt are automatically generated when inserting a new document", async () => {
        const data = userData.validHasName.data;
        const user = await new User(data).save();

        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
        expect(user.createdAt).toEqual(user.updatedAt);
    });

    test("TC_DB_04:  Leading and trailing spaces are removed when saving string fields with all valid sign up fields", async () => {
        const data = userData.validHaveSpaces.data;
        const user = await new User(data).save();

        expect(user).toBeDefined();
        expect(user._id).toBeDefined();
        for(const key of Object.keys(data)) {
            expect(user[key]).toEqual(data[key].trim());
        }
    });


    afterAll( async () => {
        await closeDB();
    });
});
