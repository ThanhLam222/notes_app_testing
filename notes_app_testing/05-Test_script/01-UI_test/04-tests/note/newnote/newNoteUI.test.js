import { test, expect } from "../../../02-fixtures/login_fixture.js";
import { NewNotePage } from "../../../01-POM/note/newnotepage.js";
import { verifyallFieldsCorrect } from "../../../03-helpers/allFieldsFormHelper.js";

test.describe("Verification New note page UI - logged in user", () => {
    let newNotePage;

    test.beforeEach(async ({login, page}) => {
        newNotePage = new NewNotePage(page);
        await newNotePage.goto();
    });

    test("TC_UI_17: New note page title visible for logged-in user", async () => {
        await expect(newNotePage.pageTitle).toBeVisible();
    });

    test("TC_UI_18: All New note form fields and elements displayed correctly for logged-in user", async () => {
        await test.step("Check all fields in new note form", async () => {
            const expectedName = ["Title:", "Description:"];
            await verifyallFieldsCorrect(newNotePage, expectedName);
        });

        await test.step("Check other elements of new note form", async () => {
            await expect(newNotePage.saveButton).toBeVisible();
        });
    });

});