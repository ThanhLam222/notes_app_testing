import {test as base} from "./createNote_fixture.js";
import { MainLayout } from "../01-POM/mainlayout.js";
import { SignInPage } from "../01-POM/auth/signinpage.js";
import { baseUser } from "../../data/base_user.js";


export const test = base.extend({
    loginToCheckAuthorization: async({browser}, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const signInPage = new SignInPage(page);

        await signInPage.goto();
        await signInPage.fillForm(baseUser.userB);
        await signInPage.clickSignInButton();
        await page.waitForURL('/notes')
        
        await use({page});
        
        const mainLayout = new MainLayout(page);
        await mainLayout.clickDropdownItem('Logout');
        await context.close();
    },
})

export { expect } from "@playwright/test";