import { test, expect } from "@jest/globals";
import { load } from "cheerio";
import { AuthService } from "../../../01-SOM/authService.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { verifyAllFieldsCorrect } from "../../../03-helpers/assertFieldsFormHelper.js";

test("TC_API_10: GET /auth/signin returns 200 OK with sign in form", async () => {
    const authService = new AuthService();
    const res = await authService.getSignInForm();

    // Check status and headers
    verifyStatusAndHeader(res);

    /**
     * Check body
     * 1. Check page's title
     * 2. Check form fields
     * 3. Check sign in button
     * 4. Check linkable text
     */

    const $ = load(res.text);

    expect($('h1').text().trim()).toEqual("Account Login");

    const form = $('form');
    expect(form.attr('action')).toEqual("/auth/signin");
    expect(form.attr('method')).toEqual("POST");

    const expectedName = ["Email:", "Password:"];
    verifyAllFieldsCorrect($, expectedName);

    const signInButton = $('form > button');
    expect(signInButton.length).toBeGreaterThan(0);
    expect(signInButton.text().trim()).toEqual("Signin");

    const linkableText = $('p.text-center');
    expect(linkableText.prop('innerText').trim()).toMatch(/Don't Have an Account?\?\s*Register/);
    expect(linkableText.find('a').attr('href')).toEqual("/auth/signup");
});