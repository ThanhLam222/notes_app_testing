import { test, expect } from "@jest/globals";
import { load } from "cheerio";
import { IndexService} from "../../01-SOM/indexService.js";
import { verifyStatusAndHeader } from "../../03-helpers/assertResponseHelper.js";


test("TC_API_40: GET '/about' returns 200 OK with correct About page content", async () => {
    const indexService = new IndexService();
    const res = await indexService.getAboutPage();

    // Check status and headers of response
    verifyStatusAndHeader(res);

    /**
     * Check response body
     * 1. Check title
     * 2. Check About page has paragraph
     * */ 
    const $ = load(res.text);

    expect($('h1').text()).toEqual("About");
    expect($('p').length).toBeGreaterThan(0);
});