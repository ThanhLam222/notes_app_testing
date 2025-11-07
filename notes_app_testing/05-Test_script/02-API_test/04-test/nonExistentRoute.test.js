import request from "supertest";
import { test, expect, beforeAll, afterAll } from "@jest/globals";
import app from "../../../../notes_app/src/app.js";
import { load } from "cheerio";
import { closeDB, connectDB } from "../02-ultils/mongoServerUtil.js";
import { verifyStatusAndHeader } from "../03-helpers/assertResponseHelper";

test("TC_API_43: Non-existent route returns 404 Not Found page", async () => {
    await connectDB();

    const service = request(app);
    const res = await service.get("/user/signin");
    const $ = load(res.text);

    // Check status and headers
    verifyStatusAndHeader(res, { expectedStatus: 404 });

    /**
     * Check body
     * 1. Check title of page
     * 2. Check `not found` notification
     * 3. Check linkable text to return to `/`
     */

    expect($('h1').text().trim()).toEqual("Not Found");
    expect($('div.card > p').text().trim()).toEqual("This page does not exists");

    const atag = $('div.card > a');
    expect(atag.attr('href')).toEqual("/");
    expect(atag.text().trim()).toEqual("Return to home");

    await closeDB();
});


