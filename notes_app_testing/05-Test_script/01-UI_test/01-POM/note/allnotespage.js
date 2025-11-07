import { MainLayout } from "../mainlayout.js";

// POM for All notes page
// Encapsulates locators and actions for the All notes page
export class AllNotesPage extends MainLayout{

    constructor(page) {
        super(page);

        //this variable is used to cache a note by ordinal number to reuse
        this._notesCache = {};
    }


// Getters for user who have no notes

    // Returns greeting text
    get greetingText() { return this._page.getByRole('heading').filter({hasText: 'Hello'}); }

    // Returns no notes message
    get noNoteNotice() { return this._page.getByText('There are no Notes yet.'); } 

    // Returns button to create new note
    get createNoteButton() { return this._page.getByRole('link', { name: 'Create One!' }); }

// Getters/ Methods to get locator for user who have notes
  
    // Returns all notes which user has
    get allNotes() { return this._page.locator('div.col-md-3 div.card-body'); }

    /**
    * Finds a note by its ordinal numbers
    * Returns an object { container, title, description, "Delete" button, and "Edit" icon } to access elements easily
     */
    getEachNote(number) { 
      if (!this._notesCache[number]){

        const noteContainer = this.allNotes.nth(number);

        // This variables is used to check action atribute of "Delete" button
        const deleteForm = noteContainer.locator('form', { hasText: 'Delete' });

        this._notesCache[number] = {
            container: noteContainer,
            title: noteContainer.getByRole('heading'),
            description: noteContainer.locator('p'),
            // to check href
            editIcon: noteContainer.locator('a'),
            // to check action
            deleteForm,
            // to clicks to delete note
            deleteButton: noteContainer.getByRole('button', { name: 'Delete' }),
        }
    }

      return this._notesCache[number];
  }

    // Returns a single note title
    getNoteTitle(number) { return this.getEachNote(number).title; }

    // Returns a single note description
    getNoteDescription(number) { return this.getEachNote(number).description; }

    // Returns "Edit" icon by a single note
    getEditIcon(number) { return this.getEachNote(number).editIcon; }

    // Returns "Delete" form by a single note to check action
    getDeleteForm(number) { return this.getEachNote(number).deleteForm; }

    // Returns "Delete" button by a single note to delete note
    getDeleteButton(number) { return this.getEachNote(number).deleteButton; }

  //Go to URL of page
  async goto() { await this._page.goto("/notes"); }

// Methods to perform action

  // Clicks "Create One!" button for user who have no notes


  async clickCreateNoteButton() { await this.createNoteButton.click(); }

  // Actions for user who have notes
  // Clicks "Edit" icon to view note's Edit form
  async clickEditIcon(number) { await this.getEditIcon(number).click(); }

  // Clicks "Delete" button to delete a note
  async clickDeleteButton(number) { await this.getDeleteButton(number).click(); }

  async removeAll(){
    while((await this.allNotes.count()) > 0) {
      await this.clickDeleteButton(0);
    }
  }

}