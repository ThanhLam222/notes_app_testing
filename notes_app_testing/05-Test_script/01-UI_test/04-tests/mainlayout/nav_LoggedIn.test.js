import { test, expect} from "../../02-fixtures/login_fixture.js";
import { AllNotesPage } from "../../01-POM/note/allnotespage.js";
import { NewNotePage } from "../../01-POM/note/newnotepage.js";
import { SignInPage } from "../../01-POM/auth/signinpage.js";
import { logout } from "../../03-helpers/logoutHelper.js";
import { verifyAllElementVisible, getElementContent } from "../../03-helpers/allElementsHelper.js";
import { verifyAllNotesPageLoaded } from "../../03-helpers/allNotesPageLoadedHelper.js";

test.describe("Navigation for logged in user", () => {
    let allNotesPage;

    test.beforeEach(async ({page}) => {
        allNotesPage = new AllNotesPage(page);
    });

    test("TC_UI_05.01: Dropdown menu visible - logged-in user", async ({login}) => {
        await expect(allNotesPage.dropdownMenu).toBeVisible();
    });

    test.describe("Dropdown items", () => {
        test("TC_UI_05.02.01: Dropdown menu contains All Notes, Add A Note, and Logout links - logged-in user", async ({login, page}) => {
            /**
             * 1. Get all items from dropdown menu.
             * 2. Assert that the number of items is 3.
             * 3. Save the text of each item into `itemsName` array for reuse.
             * 4. Check that `itemsName` contains: "All Notes", "Add A Note", and "Logout".
             * 5. Loop through `itemsName` to verify each element is visible.
             */
            const items = allNotesPage.allDropdownItems;
            const itemCount = await items.count();

            expect(itemCount).toEqual(3);

            let itemsName = await getElementContent(items);

            expect(itemsName).toEqual(expect.arrayContaining(["All Notes", "Add A Note", "Logout"]));
            await allNotesPage.openDropdownMenu();

            const eachItemArray = itemsName.map(item => allNotesPage.getDropdownItem(item));
            await verifyAllElementVisible(eachItemArray);
        });

        test("TC_UI_05.02.02: All Notes link navigates to the All notes page - logged-in user", async ({login, page}) => {
            const newNotePage = new NewNotePage(page);

            await newNotePage.goto();
            await newNotePage.clickDropdownItem("All Notes");

            await expect(page).toHaveURL("/notes");
            await verifyAllNotesPageLoaded(allNotesPage);
        });

        test("TC_UI_05.02.03: Add A Note link navigates to the New note page - logged-in user", async ({login, page}) => {
            await allNotesPage.clickDropdownItem("Add A Note");

            await expect(page).toHaveURL("/notes/add");
            const newNotePage = new NewNotePage(page);
            await expect(newNotePage.pageTitle).toBeVisible();
        });

        test("TC_UI_05.02.04: Logout link points to /auth/logout - logged-in user", async ({login, page}) => {
            await allNotesPage.openDropdownMenu();
            const logoutItem = await allNotesPage.getDropdownItem("Logout");
            const href = await logoutItem.getAttribute("href");

            expect(href).toEqual("/auth/logout");
        });

        test("TC_UI_05.02.05: Logout link: logs out user and navigates to  Sign in page - logged-in user", async ({page}) => {
            
            await logout(page);

            await expect(page).toHaveURL("/auth/signin");

            const signInPage = new SignInPage(page);
            await expect(signInPage.pageTitle).toBeVisible();
        });
    });

    test("TC_UI_05.03: Login link is not visible - logged-in user", async ({login}) => {
        await expect(allNotesPage.navLoginLink).toHaveCount(0);
    });

    test("TC_UI_05.04: Register link is not visible - logged-in user", async ({login}) => {
        await expect(allNotesPage.navRegisterLink).toHaveCount(0);
    });

});