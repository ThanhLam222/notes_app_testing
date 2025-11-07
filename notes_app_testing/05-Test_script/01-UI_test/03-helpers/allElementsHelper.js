import { expect } from "@playwright/test";

/**
 * Verifies that all elements  within a locator (or a list of locators) are visible.
 * 
 * @param {Object | Array} locators - A locator object or an array of locator objects to be tested.
 * 
 * The function checks:
 * - Each element is visible.
 */
export async function verifyAllElementVisible(locators) {

    const allElements = Array.isArray(locators) ? locators : await locators.all();
    await Promise.all(allElements.map(element => expect(element).toBeVisible()));

}

/**
 * Gets the innner text of all elements within a locator.
 * This function is used to retrieve field names or message content for comparing actual values to expected ones.
 * 
 * @param {Object} locators - A locator object whose inner texts will be retrieved.
 * 
 * The function performs:
 * - Gets the inner text of each element.
 * - Returns an array of inner texts.
 */
export async function getElementContent(locators) {
    const allElements = await locators.all();

    return await Promise.all(allElements.map(element => element.innerText()));
}