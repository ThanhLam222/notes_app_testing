import { test, expect } from "@playwright/test";
import { NewNotePage } from "../../../01-POM/note/newnotepage.js";
import { AllNotesPage } from "../../../01-POM/note/allnotespage.js";
import { EditNotePage } from "../../../01-POM/note/editnotepage.js";
import { SignInPage } from "../../../01-POM/auth/signinpage.js";
import { verifyMessageContent } from "../../../03-helpers/contentMessageHelper.js";
import { verifyAllNotesPageLoaded } from "../../../03-helpers/allNotesPageLoadedHelper.js";
import { baseUser } from "../../../../data/base_user.js";
import { createNote } from "../../../../data/helpers/createNote_helper.js";

test("TC_UI_27: Note update fails - non-logged-in user", async ({page}) => {
    /**
     * Because this test required user has at least one note after log out and test how app acts after log out
     * So perform sign in, create note and log out manually instead of using "createNote" fixture or "login" fixture
     * 1. Sign in with userA
     * 2. Create note and save noteID to use for test
     * 3. Log out
     * 4. Perform test
     */

    // Sign in with userA
    const signInPage = new SignInPage(page);
    const noteData = createNote();
    await signInPage.goto();
    await signInPage.fillForm(baseUser.userA);
    await signInPage.clickSignInButton();

    // Create note
    const newNotePage = new NewNotePage(page);
    await newNotePage.goto();
    await newNotePage.fillForm(noteData);
    await newNotePage.clickSaveButton();
    
    const allNotesPage = new AllNotesPage(page);
    await expect(page).toHaveURL("/notes");
    await verifyAllNotesPageLoaded(allNotesPage);

    // Save noteID to use for test
    const href = await page.getByRole('heading', {name: new RegExp(`^\\s*${noteData.title}\\s*`, "i")})
                                   .locator('a')
                                   .getAttribute('href');
    if (!href) {
        throw new Error(`Cannot get href for note title: "${noteData.title}"`);
    }
    const noteID = href.split("/").pop();
    
    //Log out
    await allNotesPage.clickDropdownItem("Logout");
    await expect(page).toHaveURL("/auth/signin");

    // Perform test
    const editNotePage = new EditNotePage(page);
    await editNotePage.goto(noteID);


    await test.step("Check redirected to correct URL", async () => {
        await expect(page).toHaveURL("/auth/signin");
        await expect(signInPage.pageTitle).toBeVisible();
    })

    await test.step("Check error message", async () => {
        await verifyMessageContent(signInPage, ["Not Authorized."]);
    });
});