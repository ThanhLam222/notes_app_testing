import { expect } from "@jest/globals";

/**
 * Verifies that all form fields on a page match expected labels and values.
 * 
 * @param {Object} $ - Cheerio root object representing the loaded HTML.
 * @param {Array<string>} expectedName - Array of expected field labels (e.g., ["Title:", "Description:"]).
 * @param {Object} [data={}] - Optional object containing field values to verify. 
 *                              Keys should match field names converted to lowercase with underscores (e.g., "title", "description").
 * @param {Boolean} [{strict = true} = {}] - Destructuring object to boolean variable. 
 *                                           If true, input value attributes must be defined.
 * @throws Will throw an error if:
 * - A field in `expectedName` is missing in `data` when `data` is provided.
 * - A field element has neither an <input> nor <textarea>.
 * @example
 *   verifyAllFieldsCorrect($, ["Title:", "Description:"], { title: "Note 1", description: "Details..." }, { strict: false});
 */
export function verifyAllFieldsCorrect($, expectedName, data = {}, {strict = true} = {}) {
    const allFields = $('div.mb-3');
    expect(allFields.length).toBe(expectedName.length);
    
    allFields.each((i, el) => {
        // Check label
        const fieldName = $(el).find('label').text().trim();
        expect (fieldName).toEqual(expectedName[i]);
        // console.log(`Check ${fieldName}`);
        
        // Check input/textarea value
        /**
         * If caller don't pass data to callee, return immediately.
         * If `data` is provided, check that the value matches the corresponding key in `data`.
         * Trim whitespace before comparison. If strict mode is on, the input's value must be defined.
         */
        if (Object.keys(data).length === 0) return;

        // Convert expectedName[i] to a lowercase key format matching `data` keys.
        const key = expectedName[i].replace(":", "").replace(/\s+/g, "_").toLowerCase();
        
        if (!(key in data)) {
            throw new Error(`Missing key '${key}' in provided data for field '${fieldName}'`);
        }

        const input = $(el).find('input');
        const textarea = $(el).find('textarea');

        if(input.length > 0) {
            let value = input.attr('value');
            if(strict) {
                expect(value).toBeDefined();
            }
            value = (value ?? "").trim();
            expect(value).toEqual(data[key]);
            // console.log("Check input");
        } else if (textarea.length > 0) {
            let value = textarea.text().trim();
            expect(value).toEqual(data[key]);
            // console.log("Check textarea");
        } else {
            throw new Error(`Element '${fieldName}' has no input or textarea`);
        }
    });
}