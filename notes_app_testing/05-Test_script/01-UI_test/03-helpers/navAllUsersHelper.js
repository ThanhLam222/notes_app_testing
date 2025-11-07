import { expect } from "@playwright/test";
import { IndexPage } from "../01-POM/index/indexpage.js";
import { AboutPage } from "../01-POM/index/aboutpage.js";

/**
 * Verifies notes app link active correctly.
 * 
 * @param {Object} page - Playwright page object.
 * @param {Object} pageObject - Page Object instance created from correspoding POM class, depending on the page being tested.
 * 
 * The function checks:
 * - User redirected to Index page.
 * - The Index page is rendered successfully after the link is clicked.
 */
export async function verifyNoteAppLink(page, pageObject) {
    await expect(pageObject.navRootPageLink).toBeVisible();
    
    await pageObject.clickNavRootPage();
    
    await expect(page).toHaveURL("/");
    const indexPage = new IndexPage(page);
    await expect(indexPage.pageTitle).toBeVisible();
}

/**
 * Verifies about link is activated correctly.
 * 
 * @param {Object} page - Playwright page object.
 * @param {Object} pageObject - Page Object instance created from corresponding POM class, depending on the page being tested.
 * 
 * The function checks:
 * - User redirected to About page.
 * - The About page is rendered successfully after the link is clicked.
 */
export async function verifyAboutLink(page, pageObject) {

    await expect(pageObject.navAboutLink).toBeVisible();

    await pageObject.clickNavAbout();

    await expect(page).toHaveURL("/about");
    const aboutPage = new AboutPage(page);
    await expect(aboutPage.pageTitle).toBeVisible(); 
    
}