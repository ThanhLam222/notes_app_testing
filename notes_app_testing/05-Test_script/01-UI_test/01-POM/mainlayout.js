import { expect } from '@playwright/test';

//POM for Mainlayout
export class MainLayout{
    
    constructor(page){
        this._page = page;
    }

//Getters of navigation - all users

    // Returns link to redirect to Index page
    get navRootPageLink() { return this._page.getByRole('link', { name: 'Notes App' }); }

    // Returns link to redirect to About page
    get navAboutLink() {return this._page.getByRole('link', { name: 'About' }); }

//Getters of navigation - non-logged-in user
    // Returns link to redirect to Sign in page
    get navLoginLink() { return this._page.locator('nav').getByRole('link', {name: 'Login'}); }

    // Returns link to redirect to Sign up page
    get navRegisterLink() { return this._page.locator('nav').getByRole('link', {name: 'Register'}); }

//Getters/Methods to get locator of navigation - logged-in user
    
    // Returns "Notes" button to click to open dropdown menu contains 3 items: "All Notes", "Add A Note", and "Logout"
    get dropdownMenu() { return this._page.getByRole('button', { name: 'Notes' }); }

    // Returns 3 items of dropdown menu
    get allDropdownItems() { return this._page.locator('.dropdown-menu .dropdown-item'); }

    // Returns a single item in dropdown menu by name
    getDropdownItem(nameLink) { return this._page.getByRole('link', { name: nameLink}); }

    // Returns flash/error message locators
    get resultPopUp() { return this._page.getByRole('alert'); }

    geteachMessage(message) { return this._page.getByRole('alert')
                                         .filter({ hasText: new RegExp(`^\\s*${message}\\s*`, "i") })}

    // Returns "Close" button by message
    getCloseButtonByMessage(message) { return this.geteachMessage(message).getByLabel('Close'); }

//Methods to perform action

    // Clicks "Notes App" link in navigation bar
    async clickNavRootPage() { await this.navRootPageLink.click(); }

    // Clicks "About" link in navigation bar
    async clickNavAbout() { await this.navAboutLink.click(); }

    // Clicks "Login" link in navigation bar
    async clickNavLogin() { await this.navLoginLink.click(); }

    // Clicks "Register" link in navigation bar
    async clickNavRegister() { await this.navRegisterLink.click(); }

    // Clicks "Notes" to open dropdown menu
    async openDropdownMenu() { await this.dropdownMenu.click(); }

    // Press to close dropdown
    async closeDropdownMenu() {
        await this._page.keyboard.press('Escape');
    }

    // Clicks single item in dropdown menu
    async clickDropdownItem(nameLink) { 
        await this.openDropdownMenu();
        const item = this.getDropdownItem(nameLink);
        await expect(item).toBeVisible();
        await item.click();
    }
    
    // Clicks "Close" button by message
    async clickCloseButton(message) {
        await this.getCloseButtonByMessage(message).click();
    }

    async countMessage() {
        const count = await this.resultPopUp.count();
        return count;
    }
}