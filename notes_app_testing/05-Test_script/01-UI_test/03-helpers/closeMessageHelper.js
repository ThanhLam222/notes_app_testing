import { expect } from "@playwright/test";

/**
 * Verifies that the "Close" buttons of flash or error messages are activated correctly.
 * 
 * @param {string[]} messages - An array containing all messages that are expected to be displayed.
 * @param {Object} pageObject - Page Object instance created from corresponding POM class, depending on the page being tested.
 * 
 * The function checks:
 * - Each "Close" button is visible.
 * - Each message disapears after its corresponding "Close" button is clicked.
 */
export async function verifyCloseButton(messages, pageObject) {

    for( const message of messages) {
        const closeButton = await pageObject.getCloseButtonByMessage(message);

        // Verify closeButton visible
        await expect(closeButton).toBeVisible();

        // Verify message disappear
        await pageObject.clickCloseButton(message);

        await expect (pageObject.geteachMessage(message)).toHaveCount(0);
    }
    
}