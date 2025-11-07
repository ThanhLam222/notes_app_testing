import { MainLayout } from "../mainlayout.js";

// POM for Signup page
// Encapsulates locators and actions for the signup page
export class SignUpPage extends MainLayout{
    
    constructor(page) {
        super(page);

        //this variable is used to cache a single field by field's name to reuse
        this._fieldCache = {};
    }

// Getters/ Methods to get locators

    // Returns the heading of the signup page
    get pageTitle() { return this._page.getByRole('heading', { name: 'Account Register' }); }

    // Returns all fields inside the signup form
    get allFields() { return this._page.locator('form div.mb-3'); }

   /** 
     * Finds a field by its label text (case-insensitive)
     * Return an object include container, input, and label of field
     */

    getEachField(fieldName) { 
        if(!this._fieldCache[fieldName]) {
            const fieldContainer = this.allFields.filter({ hasText: new RegExp(`^\\s*${fieldName}:?`, 'i')});
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

    // Signup button element
    get signUpButton() { return this._page.getByRole('button', { name: 'Signup' }); }

    // Paragraph containing the login link under the form
    get loginDirection() { return this._page.locator('p.text-center'); }

    // Login link scoped inside the signup form (avoids confusion with navbar login link)
    get formLoginLink() { return this.loginDirection.locator('a'); }
    
    //Go to URL of page
    async goto() { await this._page.goto('/auth/signup'); }

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
    * Fills sign up form
    * data: an object containing field names and values to fill,
    * e.g. { "name": "Test", "email": "test@gmail.com", "password": "123456", "confirm password": "123456" } 
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

   // Clicks the Signup button
   async clickSignUpButton() { await this.signUpButton.click(); }

   // Clicks the Login link inside the signup form
   async clickFormLoginLink() { await this.formLoginLink.click(); }


}