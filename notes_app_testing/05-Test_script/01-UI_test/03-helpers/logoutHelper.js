import { expect } from "@playwright/test";
import { SignInPage } from "../01-POM/auth/signinpage.js";
import { AllNotesPage } from "../01-POM/note/allnotespage.js";
import { baseUser } from "../../data/base_user.js";

/**
 * Performs the Logout action.
 * 
 * @param {Object} page - Playwright page object.
 * 
 * This function perform action below:
 * - Signs in with userA.
 * - Logs out.
 */
export async function logout(page) {
    // Logs in manually instead of using the `login` fixture, 
    // because it performs a logout and the fixture's teardown would fail.
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.fillForm(baseUser.userA);
    await signInPage.clickSignInButton();
                
    await expect(page).toHaveURL("/notes");

    const allNotesPage = new AllNotesPage(page);
    await allNotesPage.clickDropdownItem("Logout");
} 