import { expect } from "@jest/globals";

/**
 * Verifies HTTP response status, headers, and optionally cookies.
 * 
 * @param {Object} res - The response object returned by supertest request.
 * @param {Object} [{expectedStatus = 200, type = "html", checkCookie = true, location} = {}] - Destructuring object with default value.
 * If want values other than default values, pass it to callee with responding key to override.
 * @param {number} expectedStatus - Expected HTTP status code (e.g., 200, 302, 404,...). 
 * @param {string} type - Expected content type of response body. If response is a redirect (302), set type = "redirect".
 * @param {boolean} checkCookie - Whether for cookie presence in response (true) or not (false).
 * @param {string} location - Expected location header for redirects (res.headers.location) when status is 302.
 * 
 * @example
 * `verifyStatusAndHeader(res, {expectedStatus: 302, type: "redirect", checkCookie: false, location: "/auth/signin"})`
 */
export function verifyStatusAndHeader(res, {expectedStatus = 200, type = "html", checkCookie = true, location} = {}) {
    // Check response status

    expect(res.status).toBe(expectedStatus);
    const headers = res.headers;

    // Check headers

    if(checkCookie) {
        expect(headers).toHaveProperty("set-cookie");
    };

    if(type === "html") {
        expect(res.type).toBe("text/html");
    } else if(type === "redirect") {
        expect(headers).toHaveProperty("location");
        expect(headers.location).toBe(location);
    } else {
        throw new Error(`verifyStatusAndHeader: unknown type "${type}"`);
    }
}