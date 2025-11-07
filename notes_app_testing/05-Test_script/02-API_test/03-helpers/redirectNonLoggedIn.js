import { expect } from "@jest/globals";
import { load } from "cheerio";
import { verifyStatusAndHeader } from "./assertResponseHelper.js";
import { verifyMessageContent } from "./assertMessageHelper.js";
/**
 * Verifies that a response correctly redirects a non-logged-in user
 * by following the Location header.
 * 
 * @param {Object} service - instance of a service class used for testing (e.g. new AuthService(), new NoteService(),...).
 * @param {Object} res - The response object returned by supertest request.
 * 
 * @example
 * await verifyRedirectNonLoggedIn(noteService, res);
 */
export async function verifyRedirectNonLoggedin(service, res) {
    const agent = service.agent;
    const location = res.headers.location;
    expect(location).toBeDefined();
    const redirectRes = await agent.get(location);
    const $ = load(redirectRes.text);
    
    // Check status and headers
    verifyStatusAndHeader(redirectRes, { checkCookie: false});
    
    // Check body
    expect($('h1').text().trim()).toEqual("Account Login");
    
    const expectedMessages = ["Not Authorized."];
    verifyMessageContent($, expectedMessages);  
}