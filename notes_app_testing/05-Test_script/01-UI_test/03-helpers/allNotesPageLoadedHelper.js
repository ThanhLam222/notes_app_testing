import { expect } from "@playwright/test";
import { verifyAllElementVisible } from "./allElementsHelper";

/**
 * Verifies that the All Notes page is rendered successfully after redirection.
 * 
 * @param {Object} allNotesPage - Page Object instance created from the AllNotesPage POM, which contains locators for all notes.
 * 
 * The function checks:
 * - If there are notes, all notes are visible.
 * - If there are no notes, greeting text is visible.
 */
export async function verifyAllNotesPageLoaded(allNotesPage) {
    // All Notes page doesn't have page's title, 
    // so check note cards or the greeting text depending on whether notes exist
    // to ensure the page has loaded successfully.
    const notes = allNotesPage.allNotes;
    const count = await notes.count();

    if(count > 0) {
        await verifyAllElementVisible(notes);
    }
    else {
        await expect(allNotesPage.greetingText).toBeVisible();
    }
}