import { test } from "../../02-fixtures/login_fixture.js";
import { IndexPage } from "../../01-POM/index/indexpage.js";
import { SignUpPage} from "../../01-POM/auth/signuppage.js";
import { AllNotesPage} from "../../01-POM/note/allnotespage.js";
import { verifyNoteAppLink, verifyAboutLink} from "../../03-helpers/navAllUsersHelper.js";

test.describe("Navigation for all users", () => {
    test.describe("Non-logged in user", () => {
        test("TC_UI_02.01: Notes App link: visible and navigates to the root URL (/) - non-logged in user", async ({page}) => {
            const signUpPage = new SignUpPage(page);
            await signUpPage.goto();

            await verifyNoteAppLink(page, signUpPage);
       });

       test("TC_UI_03.01: About link: visible and navigates to the About page - non-logged in user", async ({page}) => {
            const indexPage = new IndexPage(page);
            await indexPage.goto();

            await verifyAboutLink(page, indexPage);
       });
    });


    test.describe("Logged in user", () => {
        test("TC_UI_02.02: Notes App link: visible and navigates to the root URL (/) - logged in user", async ({login, page}) => {
            const allNotesPage = new AllNotesPage(page);

            await verifyNoteAppLink(page, allNotesPage);
        });

        test("TC_UI_03.02: About link: visible and navigates to the About page - logged in user", async ({login, page}) => {
            const allNotesPage = new AllNotesPage(page);

            await verifyAboutLink(page, allNotesPage);
        });
    }); 
});
