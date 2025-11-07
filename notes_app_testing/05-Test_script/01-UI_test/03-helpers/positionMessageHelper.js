import { expect } from "@playwright/test";

/**
 * Verifies the position of flash or error message to ensure that 
 * they are displayed at the top of page, directly below the navigation bar.
 * 
 * @param {Object} message - Locator objects that contains all flash/ error messages displayed on the page.
 * @param {Object} page - Playwright page object.
 * @param {number} count - The number of message elements within the message locator.
 * 
 * The function checks:
 * - message locator located below navigation bar and above form (e.g: sign in form, sign up form,...).
 */
export async function verifyPositionMessage(message, page, count) {
    const navBox = await page.locator("nav").boundingBox();
    const messageFirstBox = await message.first().boundingBox();
    let messageLastBox;
    if(count > 1) {
        messageLastBox = await message.last().boundingBox();
    }
    else {
        messageLastBox = messageFirstBox;
    }

    const formBox = await page.locator("main > div.row").boundingBox();
    
    expect(messageFirstBox.y).toBeGreaterThan(navBox.y + navBox.height);
    expect(formBox.y).toBeGreaterThan(messageLastBox.y + messageLastBox.height);
}