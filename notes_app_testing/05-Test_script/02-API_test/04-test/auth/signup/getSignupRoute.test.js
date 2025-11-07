import { test, expect } from "@jest/globals";
import { load } from "cheerio";
import { AuthService } from "../../../01-SOM/authService.js";
import { verifyStatusAndHeader } from "../../../03-helpers/assertResponseHelper.js";
import { verifyAllFieldsCorrect } from "../../../03-helpers/assertFieldsFormHelper.js";


test("TC_API_01: GET /auth/signup returns 200 OK with sign up form", async () => {
    const authService = new AuthService();
    const res = await authService.getSignUpForm();

    // Check response status and headers
    verifyStatusAndHeader(res);

    /**
     * Check body
     * 1. Check title
     * 2. Check form fields
     * 3. Check sign up button
     * 4. Check linkable text
     */
    const $ = load(res.text);

    expect($('h4').text().trim()).toEqual("Account Register");

    const form = $('form');
    expect(form.attr('action')).toEqual("/auth/signup");
    expect(form.attr('method')).toEqual("POST");

    const expectedName = ["Name:", "Email:", "Password:", "Confirm Password:"];
    verifyAllFieldsCorrect($, expectedName);


    const signUpButton = $('form > button');
    expect (signUpButton.length).toBeGreaterThan(0);
    expect (signUpButton.text().trim()).toEqual("Signup");

    const linkableText = $('p.text-center');
    expect (linkableText.find('a').attr('href')).toEqual("/auth/signin");
    expect(linkableText.prop('innerText')).toMatch(/Already Have an Account\?\s*Login/);
});