import { test, expect } from "@jest/globals";
import { load } from "cheerio";
import { IndexService} from "../../01-SOM/indexService.js";
import { verifyStatusAndHeader } from "../../03-helpers/assertResponseHelper.js";


test("TC_API_39: GET '/' Returns 200 OK with correct Index page content", async () => {
    const indexService = new IndexService();
    const res = await indexService.getIndexPage();

    // Check status and headers of response
    verifyStatusAndHeader(res);

    /**
     * Check response body
     * 1. Check title
     * 2. Check app purpose
     * 3. Check register button
     * */ 
    const $ = load(res.text);
    
    expect($('h1').text()).toEqual("Notes App Nodejs And Mongodb!");

    expect($('p.lead').text()).toMatch(/A simple App to manage Notes developed with Nodejs, Express,\s* Mongodb and Javascript Technologies/);

    const registerButton = $('div.card a');
    expect(registerButton.length).toBeGreaterThan(0);
    const href = registerButton.attr('href');
    expect(href).toBeDefined();
    expect(href).toEqual("/auth/signup");
    expect(registerButton.text()).toEqual("Register");
});
