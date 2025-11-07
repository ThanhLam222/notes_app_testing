import { expect } from "@jest/globals";

/**
 * Verifies that a document has been saved and its fields match the input data.
 * 
 * @param {Object} document - The Mongoose document returned after successfully adding it to the database.
 * @param {Object} data - The original data object that was used to create the document.
 */
export function verifySaveDocumentCorrectly( document, data) {
    expect(document).toBeDefined();
    expect(document._id).toBeDefined();

    for(const key of Object.keys(data)) {
        expect(document[key]).toEqual(data[key]);
    }
}