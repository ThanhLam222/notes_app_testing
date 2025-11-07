import { MainLayout } from "../mainlayout.js";

// POM for About page
// Encapsulates locators and actions for the About page
export class AboutPage extends MainLayout{
    // Returns heading of About page
    get pageTitle() { return this._page.getByRole('heading', { name: 'About' }); }

    // Returns paragraph located below heading
    get pageParagraph() { return this._page.locator('div.card-body > p'); }
    
    // Goto URL of page
    async goto() { await this._page.goto('/about'); }
}
