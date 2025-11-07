import {test as base} from "@playwright/test"
import { MainLayout } from "../01-POM/mainlayout.js";
import {SignInPage} from "../01-POM/auth/signinpage.js"
import { baseUser } from "../../data/base_user.js";

export const test = base.extend({
    login: async ({page}, use) => {

        const signInPage = new SignInPage(page);
        await signInPage.goto();
        await signInPage.fillForm(baseUser.userA);
        await signInPage.clickSignInButton();
        await page.waitForURL('/notes')

        await use();

        const mainLayout = new MainLayout(page);
        // Prevents conflicts if a dropdown is still open at the end of the test.
        await mainLayout.closeDropdownMenu();
        
        await mainLayout.clickDropdownItem('Logout');
    },
})

export { expect } from "@playwright/test";