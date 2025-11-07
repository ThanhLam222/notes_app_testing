/**
 * Verifies count and content of success/ error messages
 * 
 * @param {Object} $ - Cheerio root object representing the loaded HTML.
 * @param {Array<string>} expectedMessages - Array of expected messages (e.g: ["You are registered."]);
 * 
 * @example
 * `verifyMessageContent($, ["Not Authorized."])`
 */
export function verifyMessageContent($, expectedMessages) {
    const messages = $('div.alert');
    
    // Check number of messages
    expect(messages.length).toBe(expectedMessages.length);
    
    // Check content of messages
    let actualMessages = [];
    messages.each((i, el) => {
        const message = $(el).prop('innerText').trim();
        actualMessages.push(message);
    });
    
    expect(actualMessages).toEqual(expect.arrayContaining(expectedMessages));
}