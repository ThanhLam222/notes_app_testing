import { MainLayout } from "../mainlayout.js";

// POM for Index page
// // Encapsulates locators and actions for the Index page
export class IndexPage extends MainLayout{
    //Returns heading of Index page
    get pageTitle() { return this._page.getByRole('heading', { name: 'Notes App Nodejs And Mongodb!' }); }

    //Returns paragraph about purpose of Notes App
    get appPurpose() { return this._page.locator('p.lead'); }

    // Register button scope inside Index page other than navigation
    get registerButton() { return this._page.getByRole('button', { name: 'Register' }); }

    // Clicks "Register" button
    async clickRegisterButton() { await this.registerButton.click(); }

    //Go to URL of page
    async goto() { await this._page.goto('/'); }
}