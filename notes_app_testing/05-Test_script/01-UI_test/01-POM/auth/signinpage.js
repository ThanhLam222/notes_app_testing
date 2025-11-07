import { MainLayout } from "../mainlayout.js";

// POM for Sign in page
// Encapsulates locators and actions for the Sign in page
export class SignInPage extends MainLayout{

    constructor(page) {
        super(page);

        //this variable is used to cache a single field by field's name to reuse
        this._fieldCache = {};
    }

// Getters/ Methods to get locators

    // Returns heading of Sign in page
    get pageTitle() { return this._page.getByRole('heading', { name: 'Account Login' }); }

    // Returns all fields inside the sign in form
    get allFields() { return this._page.locator('form div.mb-3'); }

    getEachField(fieldName) { 
        if(!this._fieldCache[fieldName]) {
            const fieldContainer = this.allFields.filter({hasText: new RegExp(`^\\s*${fieldName}:?`, 'i')}); //`^${fieldName}:?$`
            this._fieldCache[fieldName] = {
                container: fieldContainer,
                label: fieldContainer.locator('label'),
                input: fieldContainer.locator('input'),
            }
        }

        return this._fieldCache[fieldName];
    }

    // Returns the input element of a field for easier reuse in fill/getValue
    getInput(fieldName) { return this.getEachField(fieldName).input; }

    // Returns the label element of a field for easier reuse in fill/getValue
    getLabel(fieldName) { return this.getEachField(fieldName).label; }

    // Sign in button element
    get signInButton() { return this._page.getByRole('button', { name: 'Signin' }); }

    // Paragraph containing the register link under the form
    get registerDirection() { return this._page.locator('p.text-center'); }

    // Register link scoped inside the sign in form (avoids confusion with navbar register link)
    get formRegisterLink() { return this.registerDirection.locator('a'); }

    // Goto URL of page
    async goto() { await this._page.goto('/auth/signin'); }

// Methods to perform action/ get value of field

   /** 
    * Fills the input field with a given value
    * fieldName: label text of the input
    * value: text to fill
    */
   async fillField(fieldName, value){
        await this.getInput(fieldName).fill(value);
   }

   /** 
    * Fills sign in form
    * data: an object containing field names and values to fill,
    * e.g. { "email": "test@gmail.com", "password": "123456" }
    */
   async fillForm(data){
        for (const [field, value] of Object.entries(data)){
            await this.fillField(field, value);
        }
   }

    // Returns the current value of the input field
   async getFieldValue(fieldName){
        const value = await this.getInput(fieldName).inputValue();
        return value;
   }

   // Clicks the Signin button
   async clickSignInButton() { await this.signInButton.click(); }

   // Clicks the Register link inside the sign in form
   async clickFormRegisterLink() { await this.formRegisterLink.click(); }

}