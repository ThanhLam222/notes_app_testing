import { expect } from "@playwright/test";
import { verifyAllElementVisible, getElementContent } from "./allElementsHelper";

/**
 * Verifies that all fields are displayed correctly.
 * This function only applies to page that are displayed as forms.
 * 
 * @param {Object} pageObject - Page Object instance created from corresponding POM class, depending on the page being tested.
 * @param {string[]} expectedName - An array containing the name of all fields in the expected order.
 * 
 * The function checks:
 * - The number of fields matches the expected field count.
 * - The form contains all expected fields, and they are displayed in the correct order.
 */
export async function verifyallFieldsCorrect(pageObject, expectedName) {
    const allFieldsLocator = pageObject.allFields;
    const allFieldsName = await getElementContent(allFieldsLocator);
    
    /** 
     * Fields must follow a specific order, so we use `toEqual` instead of using expect.arrayContaining
     * to verify their text exactly
     */
    await expect(allFieldsLocator).toHaveCount(expectedName.length);
    expect(allFieldsName).toEqual(expectedName);
    const eachFieldArray = allFieldsName.map(fieldName => pageObject.getEachField(fieldName).container);
    await verifyAllElementVisible(eachFieldArray);
}