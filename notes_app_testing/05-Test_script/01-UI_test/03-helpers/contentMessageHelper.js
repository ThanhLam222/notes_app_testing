import { expect} from "@playwright/test"
import { verifyAllElementVisible, getElementContent } from "./allElementsHelper";

/**
 * Verifies that all flash or error messages are displayed with correct content and count.
 * 
 * @param {Object} pageObject - Page Object instance created from corresponding POM class, depending on the page being tested.
 * @param {string[]} expectedMessages - An array containing all messages that are expected to be displayed.
 * 
 * The function checks:
 * - All messages are visible.
 * - The number of displayed messages matches the expected count.
 * - The content of each message is correct.
 */
export async function verifyMessageContent(pageObject, expectedMessages) {
    const message = pageObject.resultPopUp;
    await verifyAllElementVisible(message);
                        
    expect(await pageObject.countMessage()).toEqual(expectedMessages.length);
    expect(await getElementContent(message)).toEqual(expect.arrayContaining(expectedMessages)); 
}