import { test, expect, jest } from "@jest/globals";
import { load } from "cheerio";
// import { AuthService } from "../01-SOM/authService.js";
import { closeDB, connectDB } from "../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../03-helpers/assertResponseHelper";

test("TC_API_44: 500 Internal Server Error page is returned when request fails", async () => {
    await connectDB();

    /**
     * Mock the logout function to always throw an error,
     * used to test the 500 error page.
     * 
     * Note:
     * 1. Use dynamic import for `app` or `SOM` classes **after mocking** the controller.
     *    This ensures that when these modules import the controller internally,
     *    they get the mocked `logout` function instead of the real one.
     * 2. This avoids modifying the source code and keeps the mock local to this test.
     */
    const originalModule = await import("../../../../notes_app/src/controllers/auth.controllers.js");
    jest.unstable_mockModule(
        "../../../../notes_app/src/controllers/auth.controllers.js",
        () => ({
            ...originalModule,
            logout: jest.fn((req, res, next) => next(new Error("Logout failed"))),
        })
    );
    const { AuthService } = await import("../01-SOM/authService.js");

    const authService = new AuthService();
    const res = await authService.logout();
    const $ = load(res.text);

    // Check status and headers
    verifyStatusAndHeader(res, { expectedStatus: 500 });

    /**
     * Check body
     * 1. Check page's title
     * 2. Check error message
     * 3. Check linkable text links to "/"
     */
    expect($('h1').text().trim()).toEqual("Internal Server Error");
    expect($('div.card > p').text().trim()).toEqual("Error: Logout failed");

    const atag = $('div.card > a');
    expect(atag.attr('href')).toEqual("/");
    expect(atag.text().trim()).toEqual("Return to home");

    await closeDB();
});