import { MainLayout } from "../mainlayout.js";

// POM for New note page
// Encapsulates locators and actions for the New note page
export class NewNotePage extends MainLayout{

    constructor(page) {
        super(page);

        //this variable is used to cache a single field by field's name to reuse
        this._fieldCache = {};
    }

// Getters/ Methods to get locators

    // Returns heading of New note page
    get pageTitle() { return this._page.getByRole('heading', { name: 'New Note' }); }

    // Returns all fields inside the New note form
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
                input: fieldContainer.locator('input, textarea'),
            }
        }

        return this._fieldCache[fieldName];
    }

    // Returns the input element of a field for easier reuse in fill/getValue
    getInput(fieldName) { return this.getEachField(fieldName).input; }

    // Returns the label element of a field for easier reuse in fill/getValue
    getLabel(fieldName) { return this.getEachField(fieldName).label; }

    // Save button element
    get saveButton() { return this._page.getByRole('button', { name: 'Save' }); }

    //Go to URL of page
    async goto() { await this._page.goto('/notes/add'); }

    //Methods to performs action/ get field's value

   /** 
    * Fills the input field with a given value
    * fieldName: label text of the input
    * value: text to fill
    */
    async fillField(fieldName, value){
        await this.getInput(fieldName).fill(value);
    }

   // Fills new note form
   /**
    * Fills new note form
    * data: an object containing field names and values to fill,
    * e.g. { "title": "Test", "description": "test note" } 
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

    // Clicks the Save button
   async clickSaveButton() { await this.saveButton.click(); }


}